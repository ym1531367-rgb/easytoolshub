import React, { useState, useEffect } from 'react';

type Format = 'jpeg' | 'png' | 'webp';

const ConvertImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setImageUrl(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
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

    const handleConvert = (format: Format) => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            const mimeType = `image/${format}`;
            const dataUrl = canvas.toDataURL(mimeType);

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${file?.name.split('.')[0]}_converted.${format}`;
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
                         <p className="mt-2 text-sm text-gray-600">Original: {file.name}</p>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-center mb-4">Convert & Download As</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleConvert('jpeg')}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                JPG
                            </button>
                             <button
                                onClick={() => handleConvert('png')}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                PNG
                            </button>
                             <button
                                onClick={() => handleConvert('webp')}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                WEBP
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setFile(null)}
                            className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition duration-300"
                        >
                            Choose Another Image
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default ConvertImage;