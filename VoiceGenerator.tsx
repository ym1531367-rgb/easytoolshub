import React, { useState } from 'react';
import { generateSpeechFromText } from '../services/geminiService';

// Helper function to decode base64 string to Uint8Array
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to create a WAV file blob from raw PCM data
const createWavBlob = (pcmData: Uint8Array): Blob => {
    const sampleRate = 24000; // Gemini TTS sample rate is 24kHz
    const numChannels = 1;
    const bitsPerSample = 16;
    
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    // RIFF chunk descriptor
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');

    // "fmt " sub-chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // audio format (1 is PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // byte rate
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); // block align
    view.setUint16(34, bitsPerSample, true);

    // "data" sub-chunk
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Write the PCM data
    for (let i = 0; i < dataSize; i++) {
        view.setUint8(44 + i, pcmData[i]);
    }
    
    return new Blob([view], { type: 'audio/wav' });
};


const voices = [
    { id: 'Kore', name: 'Kore (Female, Calm)' },
    { id: 'Puck', name: 'Puck (Male, Energetic)' },
    { id: 'Charon', name: 'Charon (Male, Deep)' },
    { id: 'Fenrir', name: 'Fenrir (Male, Raspy)' },
    { id: 'Zephyr', name: 'Zephyr (Female, Cheerful)' },
];

const VoiceGenerator: React.FC = () => {
    const [text, setText] = useState('Hello, welcome to EasyToolsHub! You can generate realistic speech from any text.');
    const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to generate audio.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const base64Audio = await generateSpeechFromText(text, selectedVoice);
            const pcmData = decodeBase64(base64Audio);
            const wavBlob = createWavBlob(pcmData);
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
                placeholder="Type or paste the text you want to convert to speech..."
                maxLength={500}
            ></textarea>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-1/2">
                    <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">Select a Voice</label>
                    <select
                        id="voice-select"
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        disabled={isLoading}
                    >
                        {voices.map(voice => (
                            <option key={voice.id} value={voice.id}>{voice.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full sm:w-1/2 flex items-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Generating...' : 'Generate Audio'}
                    </button>
                </div>
            </div>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <div className="mt-4 flex justify-center items-center min-h-[60px]">
                {isLoading && (
                    <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <span>Generating audio...</span>
                    </div>
                )}
                {audioUrl && (
                    <audio controls src={audioUrl} className="w-full max-w-md">
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
        </div>
    );
};

export default VoiceGenerator;