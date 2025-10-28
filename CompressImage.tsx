import React, { useState, useEffect } from 'react';

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const CompressImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(0.8);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setImageUrl(null);
            setCompressedUrl(null);
            setOriginalSize(0);
            setCompressedSize(0);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target?.result as string);
            setOriginalSize(file.size);
            compressImage(e.target?.result as string, quality);
        };
        reader.readAsDataURL(file);

    }, [file]);
    
    useEffect(() => {
        if (imageUrl) {
            compressImage(imageUrl, quality);
        }
    }, [quality, imageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && ['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError('Please select a valid image file (JPG, PNG, WEBP).');
        }
    };

    const compressImage = (dataUrl: string, quality: number) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            setCompressedUrl(compressedDataUrl);
            const size = compressedDataUrl.length * (3/4) - (compressedDataUrl.endsWith('==') ? 2 : (compressedDataUrl.endsWith('=') ? 1 : 0));
            setCompressedSize(size);
        };
    };

    return (
        <div>
            {!file ? (
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
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Original</h3>
                            <img src={imageUrl!} alt="Original" className="max-h-64 mx-auto rounded-lg shadow-md" />
                            <p className="mt-2 text-sm font-medium">{formatBytes(originalSize)}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Compressed (Preview)</h3>
                            <img src={compressedUrl!} alt="Compressed" className="max-h-64 mx-auto rounded-lg shadow-md" />
                            <p className="mt-2 text-sm font-semibold text-primary">{formatBytes(compressedSize)}</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">Quality: {Math.round(quality * 100)}%</label>
                        <input
                            type="range"
                            id="quality"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     {originalSize > 0 && (
                        <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-center font-bold text-lg">
                            Size Reduction: {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                        </div>
                     )}

                    <div className="flex justify-center items-center gap-4">
                        <a
                            href={compressedUrl!}
                            download={`${file.name.split('.')[0]}_compressed.jpg`}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Download Compressed Image
                        </a>
                        <button
                            onClick={() => setFile(null)}
                            className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition duration-300"
                        >
                            Choose Another
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default CompressImage;