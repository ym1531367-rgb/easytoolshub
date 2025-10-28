import React, { useState } from 'react';
import { extractTextFromPdfImages, getPdfJsLib } from '../services/geminiService';

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center text-center">
        <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="mt-4 text-gray-600">AI is reading your PDF... <br/>This may take a moment.</span>
    </div>
);

const PdfToText: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setExtractedText('');
            setError(null);
            setInfo(null);
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };
    
    const handleExtract = async () => {
        if (!file) {
            setError("Please select a PDF file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setInfo(null);
        setExtractedText('');

        try {
            const pdfjsLib = await getPdfJsLib();

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const imageParts = [];
            const numPagesToProcess = Math.min(pdf.numPages, 15);

            if (pdf.numPages > 15) {
                setInfo('For performance, this demo processes a maximum of 15 pages.');
            }

            for (let i = 1; i <= numPagesToProcess; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                imageParts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: dataUrl.split(',')[1]
                    }
                });
            }
            
            const text = await extractTextFromPdfImages(imageParts);
            setExtractedText(text);

        } catch (err: any) {
            console.error("PDF to Text error:", err);
            setError(err.message || 'Failed to process PDF. The file may be encrypted or corrupted.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(extractedText);
    };

    const handleDownload = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${file?.name.replace('.pdf', '') || 'extracted_text'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <div className="p-4 bg-slate-100 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-slate-700">This tool uses AI to read the content of your PDF. It works best with text-based documents. Results may vary for complex layouts or handwritten text.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                 <button
                    onClick={handleExtract}
                    disabled={isLoading || !file}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? 'Extracting...' : 'Extract Text'}
                </button>
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {info && <p className="text-blue-500 mt-4 text-center">{info}</p>}
            
            <div className="mt-8">
                {isLoading ? (
                     <div className="h-72 flex justify-center items-center"><LoadingSpinner /></div>
                ) : (
                    <div>
                        <textarea
                            value={extractedText}
                            readOnly
                            placeholder="Extracted text will appear here."
                            className="w-full h-72 p-4 border-2 border-gray-200 rounded-lg bg-slate-50 focus:outline-none"
                        ></textarea>
                         {extractedText && (
                            <div className="flex justify-center gap-4 mt-4">
                                <button onClick={handleCopy} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition">Copy to Clipboard</button>
                                <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Download as .txt</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfToText;