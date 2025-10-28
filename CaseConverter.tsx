import React, { useState } from 'react';

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const toSentenceCase = () => {
    if (!text) return;
    const lower = text.toLowerCase();
    const result = lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(result);
  };
  
  const toTitleCase = () => {
    if (!text) return;
    const result = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const conversionButtons = [
    { name: 'Sentence case', action: toSentenceCase },
    { name: 'lower case', action: () => setText(text.toLowerCase()) },
    { name: 'UPPER CASE', action: () => setText(text.toUpperCase()) },
    { name: 'Title Case', action: toTitleCase },
  ];

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Type or paste your text to convert..."
      ></textarea>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {conversionButtons.map(({ name, action }) => (
          <button
            key={name}
            onClick={action}
            disabled={!text}
            className="px-4 py-3 bg-slate-100 text-slate-800 font-semibold rounded-lg hover:bg-slate-200 transition duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {name}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleCopy}
          disabled={!text}
          className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
        >
          {copied ? 'Copied!' : 'Copy Text'}
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

export default CaseConverter;