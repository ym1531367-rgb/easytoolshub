import React, { useState, useMemo } from 'react';

const TextReverser: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const reversedText = useMemo(() => {
    return text.split('').reverse().join('');
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="original-text" className="block text-sm font-medium text-gray-700 mb-1">Original Text</label>
        <textarea
          id="original-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
          placeholder="Type or paste your text here..."
        ></textarea>
      </div>
      <div>
        <label htmlFor="reversed-text" className="block text-sm font-medium text-gray-700 mb-1">Reversed Text</label>
        <textarea
          id="reversed-text"
          value={reversedText}
          readOnly
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg bg-slate-50 focus:outline-none"
          placeholder="Reversed text will appear here..."
        ></textarea>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleCopy}
          disabled={!reversedText}
          className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
        >
          {copied ? 'Copied!' : 'Copy Reversed Text'}
        </button>
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="px-6 py-2 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition duration-300 disabled:bg-gray-400"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TextReverser;