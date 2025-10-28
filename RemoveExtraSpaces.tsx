import React, { useState, useMemo } from 'react';

const RemoveExtraSpaces: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const { cleanedText, spacesRemoved } = useMemo(() => {
    if (!text) return { cleanedText: '', spacesRemoved: 0 };
    
    // Count original spaces (including tabs, newlines)
    const originalSpaces = (text.match(/\s/g) || []).length;
    
    // Replace multiple spaces/tabs with a single space, but not newlines
    let result = text.replace(/[ \t]+/g, ' ');
    // Replace 3 or more newlines with 2, preserving paragraph breaks
    result = result.replace(/\n{3,}/g, '\n\n');
    // Remove spaces at the beginning/end of each line
    result = result.split('\n').map(line => line.trim()).join('\n');
    // Trim the whole text
    result = result.trim();
    
    const cleanedSpaces = (result.match(/\s/g) || []).length;
    
    return { cleanedText: result, spacesRemoved: originalSpaces - cleanedSpaces };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedText);
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
          placeholder="Paste text with extra spaces here..."
        ></textarea>
      </div>
       {spacesRemoved > 0 && (
        <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-center">
            Successfully removed <span className="font-bold">{spacesRemoved}</span> extra space(s).
        </div>
       )}
      <div>
        <label htmlFor="cleaned-text" className="block text-sm font-medium text-gray-700 mb-1">Cleaned Text</label>
        <textarea
          id="cleaned-text"
          value={cleanedText}
          readOnly
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg bg-slate-50 focus:outline-none"
          placeholder="Cleaned text will appear here..."
        ></textarea>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleCopy}
          disabled={!cleanedText}
          className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
        >
          {copied ? 'Copied!' : 'Copy Cleaned Text'}
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

export default RemoveExtraSpaces;