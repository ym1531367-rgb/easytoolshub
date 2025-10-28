import React, { useState } from 'react';
import { removeImageBackground } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center text-center">
        <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="mt-4 text-gray-600">AI is analyzing your image... <br/>This may take a moment.</span>
    </div>
);


const BackgroundRemover: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && ['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
            setFile(selectedFile);
            setResultUrl(null);
            setError(null);
            const reader = new FileReader();
            reader.onload = (ev) => setOriginalUrl(ev.target?.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setOriginalUrl(null);
            setError('Please select a valid image file (JPG, PNG, WEBP).');
        }
    };

    const handleRemoveBackground = async () => {
        if (!file) {
            setError('Please select an image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultUrl(null);

        try {
            const base64Data = await fileToBase64(file);
            const newImageUrl = await removeImageBackground(base64Data, file.type);
            setResultUrl(newImageUrl);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            {!file && (
                <div className="flex justify-center items-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col justify-center items-center w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6 text-center">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload an image</span></p>
                      <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                    </div>
                    <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
            )}
            
            {file && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="text-center p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Original</h3>
                            <img src={originalUrl!} alt="Original" className="max-h-64 mx-auto rounded-md" />
                        </div>
                        <div className="text-center p-4 border rounded-lg h-full flex flex-col justify-center items-center bg-slate-50" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23DDD' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`}}>
                            <h3 className="font-semibold mb-2">Result</h3>
                            {isLoading ? <LoadingSpinner /> : resultUrl ? <img src={resultUrl} alt="Background removed" className="max-h-64 mx-auto rounded-md" /> : <p className="text-gray-500">Result will appear here</p>}
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={handleRemoveBackground}
                            disabled={isLoading}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Processing...' : 'Remove Background'}
                        </button>
                        {resultUrl && (
                             <a
                                href={resultUrl}
                                download={`${file.name.split('.')[0]}_no_bg.png`}
                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Download
                            </a>
                        )}
                    </div>
                     <div className="text-center">
                        <button onClick={() => setFile(null)} className="text-sm text-slate-600 hover:text-primary">Use another image</button>
                     </div>
                </div>
            )}
             {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default BackgroundRemover;