import React, { useState, useRef, useEffect } from 'react';

const MemeGenerator: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    imageRef.current = img;
                    setImage(event.target?.result as string);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (image && canvasRef.current && imageRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = imageRef.current;
            if (!ctx) return;

            // Scale image to fit canvas
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Style text
            ctx.font = 'bold 48px Impact';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';

            // Draw top text
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 60);
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, 60);
            
            // Draw bottom text
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
    }, [image, topText, bottomText]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Top Text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Bottom Text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="flex justify-center items-center w-full">
                <label htmlFor="image-upload" className="flex flex-col justify-center items-center w-full h-32 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6 text-center">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload an image</span></p>
                    </div>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            </div>
            
            <div className="flex justify-center bg-gray-200">
                <canvas ref={canvasRef} width="500" height="500" className="w-full max-w-lg border rounded-lg"></canvas>
            </div>

            <div className="text-center">
                <button
                    onClick={handleDownload}
                    disabled={!image}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                    Download Meme
                </button>
            </div>
        </div>
    );
};

export default MemeGenerator;
