
import React, { useState, useMemo } from 'react';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/) : [];
    const characters = text.length;
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+(?!\s.|$)/g) || []).length + (trimmedText.endsWith('.') || trimmedText.endsWith('!') || trimmedText.endsWith('?') ? 0 : 1) : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    
    // if text is empty, sentences should be 0.
    const finalSentences = trimmedText.length > 0 ? sentences : 0;

    return {
      words: words.length,
      characters,
      sentences: finalSentences,
      paragraphs,
    };
  }, [text]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Start typing or paste your text here..."
      ></textarea>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-gray-500">Words</p>
          <p className="text-3xl font-bold text-primary">{stats.words}</p>
        </div>
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-gray-500">Characters</p>
          <p className="text-3xl font-bold text-primary">{stats.characters}</p>
        </div>
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-gray-500">Sentences</p>
          <p className="text-3xl font-bold text-primary">{stats.sentences}</p>
        </div>
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-gray-500">Paragraphs</p>
          <p className="text-3xl font-bold text-primary">{stats.paragraphs}</p>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
