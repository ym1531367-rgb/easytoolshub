import React, { useState, useEffect, useRef } from 'react';

const ResizeImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const originalDimensions = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (!file) {
            setImageUrl(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setImageUrl(url);
            const img = new Image();
            img.src = url;
            img.onload = () => {
                originalDimensions.current = { width: img.width, height: img.height };
                setWidth(img.width);
                setHeight(img.height);
            };
        };
        reader.readAsDataURL(file);
    }, [file]);

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

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value) || 0;
        setWidth(newWidth);
        if (maintainAspectRatio && originalDimensions.current.width > 0) {
            const ratio = originalDimensions.current.height / originalDimensions.current.width;
            setHeight(Math.round(newWidth * ratio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value) || 0;
        setHeight(newHeight);
        if (maintainAspectRatio && originalDimensions.current.height > 0) {
            const ratio = originalDimensions.current.width / originalDimensions.current.height;
            setWidth(Math.round(newHeight * ratio));
        }
    };

    const handleDownload = () => {
        if (!imageUrl || width <= 0 || height <= 0) {
            setError('Please set valid dimensions.');
            return;
        }
        
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const link = document.createElement('a');
            link.href = canvas.toDataURL(file?.type || 'image/png');
            link.download = `${file?.name.split('.')[0]}_resized.${file?.type.split('/')[1] || 'png'}`;
            link.click();
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
                    <div className="text-center">
                        <img src={imageUrl!} alt="Preview" className="max-h-80 mx-auto rounded-lg shadow-md" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                            <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width (pixels)</label>
                            <input type="number" id="width" value={width} onChange={handleWidthChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                             <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (pixels)</label>
                             <input type="number" id="height" value={height} onChange={handleHeightChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <input type="checkbox" id="aspect-ratio" checked={maintainAspectRatio} onChange={(e) => setMaintainAspectRatio(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="aspect-ratio" className="ml-2 block text-sm text-gray-900">Maintain aspect ratio</label>
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Resize & Download
                        </button>
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

export default ResizeImage;