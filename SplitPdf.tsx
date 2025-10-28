import React, { useState, useEffect } from 'react';

declare const PDFLib: any;

const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    if (!rangeStr.trim()) return [];

    const parts = rangeStr.replace(/\s/g, '').split(',');
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPages) indices.add(i - 1);
                }
            }
        } else {
            const page = Number(part);
            if (!isNaN(page) && page > 0 && page <= maxPages) {
                indices.add(page - 1);
            }
        }
    }
    return Array.from(indices).sort((a, b) => a - b);
};

const SplitPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [ranges, setRanges] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPageCount(0);
            setRanges('');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                setPageCount(pdfDoc.getPageCount());
                setRanges(`1-${pdfDoc.getPageCount()}`);
            } catch (err) {
                setError("Could not read the PDF. It might be corrupted or encrypted.");
                setFile(null);
            }
        };
        reader.readAsArrayBuffer(file);
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSplit = async () => {
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }
        const pageIndices = parsePageRanges(ranges, pageCount);
        if (pageIndices.length === 0) {
            setError('Please enter valid page numbers or ranges to extract.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const newPdfDoc = await PDFDocument.create();
            
            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
            copiedPages.forEach((page: any) => newPdfDoc.addPage(page));

            const pdfBytes = await newPdfDoc.save();
            
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${file.name.replace('.pdf', '')}_split.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (err) {
            console.error("Split PDF error:", err);
            setError('An error occurred while splitting the PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center w-full">
                 <label htmlFor="pdf-upload" className="flex flex-col justify-center items-center w-full h-32 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload a PDF</span></p>
                    </div>
                    <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            
            {file && (
                <div className="mt-6 p-4 bg-slate-100 rounded-lg text-center">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-600">Total pages: {pageCount}</p>
                </div>
            )}

            {pageCount > 0 && (
                <div className="mt-6">
                    <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">Pages to extract</label>
                    <input
                        type="text"
                        id="pages"
                        value={ranges}
                        onChange={(e) => setRanges(e.target.value)}
                        placeholder="e.g., 1-3, 5, 8-10"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use commas to separate pages or ranges (e.g., 2, 5-8, 12).</p>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            <div className="mt-8 text-center">
                <button
                    onClick={handleSplit}
                    disabled={isLoading || !file}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    {isLoading ? 'Splitting...' : 'Split PDF'}
                </button>
            </div>
        </div>
    );
};

export default SplitPdf;
