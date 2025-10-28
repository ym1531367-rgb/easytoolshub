import React, { useState } from 'react';
import { getPdfJsLib } from '../services/geminiService';

declare const PDFLib: any;

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const CompressPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState('medium');
    const [result, setResult] = useState<{ oldSize: number; newSize: number } | null>(null);
    const [progress, setProgress] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
            setResult(null);
            setProgress('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleCompress = async () => {
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResult(null);
        setProgress('Initializing...');

        try {
            const pdfjsLib = await getPdfJsLib();
            
            const { PDFDocument } = PDFLib;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const newPdfDoc = await PDFDocument.create();

            const jpegQuality = quality === 'low' ? 0.6 : 0.8;
            const scale = quality === 'low' ? 1.0 : 1.5;

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(`Processing page ${i} of ${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (!context) {
                    throw new Error('Could not get canvas context');
                }
                
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                
                const imageData = canvas.toDataURL('image/jpeg', jpegQuality);
                const jpgImage = await newPdfDoc.embedJpg(imageData);
                
                const newPage = newPdfDoc.addPage([canvas.width, canvas.height]);
                newPage.drawImage(jpgImage, {
                    x: 0,
                    y: 0,
                    width: newPage.getWidth(),
                    height: newPage.getHeight(),
                });
            }

            setProgress('Finalizing document...');
            const pdfBytes = await newPdfDoc.save();
            
            setResult({ oldSize: file.size, newSize: pdfBytes.length });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${file.name.replace('.pdf', '')}_compressed.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            setFile(null);

        } catch (err: any) {
            console.error("Compress PDF error:", err);
            setError(err.message || 'Failed to compress PDF. It may be corrupted or password-protected.');
        } finally {
            setIsLoading(false);
            setProgress('');
        }
    };

    return (
        <div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-sm text-yellow-800"><b>Note:</b> This tool compresses PDFs by converting pages into images. This significantly reduces file size but may decrease text quality. It's best for documents with lots of images.</p>
            </div>
            
            <div className="mt-6">
                <label htmlFor="pdf-upload" className="flex flex-col justify-center items-center w-full h-32 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                         <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload a PDF</span></p>
                    </div>
                    <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            
            {file && <p className="mt-4 text-center font-semibold">{file.name}</p>}

            <div className="mt-6">
                <h3 className="text-center font-semibold mb-2">Compression Level</h3>
                <div className="flex justify-center gap-4">
                    <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="quality" value="medium" checked={quality === 'medium'} onChange={() => setQuality('medium')} className="text-primary focus:ring-primary" />
                        <span>Basic Compression (Good Quality)</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="quality" value="low" checked={quality === 'low'} onChange={() => setQuality('low')} className="text-primary focus:ring-primary" />
                        <span>Strong Compression (Smaller Size)</span>
                    </label>
                </div>
            </div>
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            <div className="mt-8 text-center">
                <button
                    onClick={handleCompress}
                    disabled={isLoading || !file}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    {isLoading ? 'Compressing...' : 'Compress PDF'}
                </button>
            </div>
            
            {isLoading && <p className="mt-4 text-center text-gray-600">{progress}</p>}

            {result && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-green-800">Compression Complete!</h3>
                    <div className="flex justify-center items-center gap-6 mt-2">
                        <div>
                            <p className="text-sm text-gray-500">Original Size</p>
                            <p className="text-lg font-semibold">{formatBytes(result.oldSize)}</p>
                        </div>
                        <div className="text-2xl font-bold text-primary">&rarr;</div>
                        <div>
                            <p className="text-sm text-gray-500">New Size</p>
                            <p className="text-lg font-semibold">{formatBytes(result.newSize)}</p>
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-green-600">
                        Saved {(((result.oldSize - result.newSize) / result.oldSize) * 100).toFixed(1)}%
                    </p>
                </div>
            )}
        </div>
    );
};

export default CompressPdf;