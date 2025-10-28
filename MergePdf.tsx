import React, { useState } from 'react';

declare const PDFLib: any;

const MergePdf: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least two PDF files to merge.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const donorPdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await pdfDoc.copyPages(donorPdf, donorPdf.getPageIndices());
                copiedPages.forEach((page: any) => pdfDoc.addPage(page));
            }
            const pdfBytes = await pdfDoc.save();
            
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'merged_document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            setFiles([]);

        } catch (err) {
            console.error("Merge PDF error:", err);
            setError('An error occurred while merging the PDFs. Please ensure they are valid, non-encrypted PDF files.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center w-full">
                <label htmlFor="pdf-upload" className="flex flex-col justify-center items-center w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h2a4 4 0 014 4v6m-4 4h2a4 4 0 004-4V6a4 4 0 00-4-4H7m6 10v4m-3-4v4m-3-4v4m6-4v4m-6-4v4"></path></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">Select multiple PDF files</p>
                    </div>
                    <input id="pdf-upload" type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            
            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Selected files ({files.length}):</h3>
                    <ul className="space-y-2 max-h-60 overflow-auto bg-slate-50 p-3 rounded-md border">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
                                <span className="text-sm truncate">{file.name}</span>
                                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 font-bold ml-4">
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            <div className="mt-8 text-center">
                <button
                    onClick={handleMerge}
                    disabled={isLoading || files.length < 2}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    {isLoading ? 'Merging...' : `Merge ${files.length} PDFs`}
                </button>
            </div>
        </div>
    );
};

export default MergePdf;