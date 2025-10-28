import React, { useState } from 'react';
import { generateImageFromText } from '../services/geminiService';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <span className="ml-3 text-gray-600">Generating your masterpiece...</span>
    </div>
);

const TextToImage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');

    const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const url = await generateImageFromText(prompt, aspectRatio);
            setImageUrl(url);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${prompt.slice(0, 20).replace(/\s/g, '_')}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cute cat wearing a superhero cape"
                    className="flex-grow w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>

            <div className="my-4">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-600 mr-2">Aspect Ratio:</span>
                    {aspectRatios.map(ratio => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          disabled={isLoading}
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            aspectRatio === ratio
                              ? 'bg-primary text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            
            <div className="mt-4 flex justify-center items-center h-96 bg-slate-100 rounded-lg border-2 border-dashed border-gray-300">
                {isLoading ? (
                    <LoadingSpinner />
                ) : imageUrl ? (
                    <img src={imageUrl} alt={prompt} className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                    <p className="text-gray-500">Your generated image will appear here.</p>
                )}
            </div>

            {imageUrl && !isLoading && (
                 <div className="mt-4 text-center">
                    <button
                        onClick={handleDownload}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Download Image
                    </button>
                 </div>
            )}
        </div>
    );
};

export default TextToImage;