
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ALL_TOOLS } from '../constants';
import { Tool } from '../types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() => {
    if (!query) return [];
    return ALL_TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };
  
  const handleSuggestionClick = () => {
      setQuery('');
      setShowSuggestions(false);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(query.length > 0)}
          placeholder="Search for a tool (e.g., 'Word Counter')"
          className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {showSuggestions && filteredTools.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          <ul>
            {filteredTools.map(tool => (
              <li key={tool.id}>
                <Link
                  to={`/tool/${tool.id}`}
                  onClick={handleSuggestionClick}
                  className="block px-5 py-3 hover:bg-slate-100 transition-colors duration-200"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
