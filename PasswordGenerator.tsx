import React, { useState, useEffect } from 'react';

const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let charPool = lowerChars;
        if (includeUppercase) charPool += upperChars;
        if (includeNumbers) charPool += numberChars;
        if (includeSymbols) charPool += symbolChars;

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            newPassword += charPool[randomIndex];
        }
        setPassword(newPassword);
        setCopied(false);
    };
    
    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeNumbers, includeSymbols]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStrength = () => {
        let strength = 0;
        if (length >= 8) strength++;
        if (length >= 12) strength++;
        if (length >= 16) strength++;
        if (includeUppercase) strength++;
        if (includeNumbers) strength++;
        if (includeSymbols) strength++;
        if (strength > 4) return { text: 'Very Strong', color: 'bg-green-600' };
        if (strength > 2) return { text: 'Strong', color: 'bg-yellow-500' };
        return { text: 'Weak', color: 'bg-red-500' };
    };

    const strength = getStrength();

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
                <input
                    type="text"
                    value={password}
                    readOnly
                    className="w-full p-4 pr-24 text-lg font-mono bg-slate-100 border-2 border-gray-200 rounded-lg focus:outline-none"
                    placeholder="Your password here..."
                />
                <button
                    onClick={handleCopy}
                    className="absolute top-1/2 right-2 -translate-y-1/2 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            
            <div className="flex items-center justify-between">
                <span className="text-gray-700">Password Strength:</span>
                <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 rounded-full ${strength.color}`}></div>
                    <span className="font-semibold">{strength.text}</span>
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-white">
                <div>
                    <label htmlFor="length" className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Password Length</span>
                        <span className="font-bold text-primary">{length}</span>
                    </label>
                    <input
                        type="range"
                        id="length"
                        min="8"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <span>Uppercase (A-Z)</span>
                    </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <span>Numbers (0-9)</span>
                    </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <span>Symbols (!@#$)</span>
                    </label>
                </div>
            </div>

            <div className="text-center">
                 <button
                    onClick={generatePassword}
                    className="w-full px-8 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition duration-300"
                >
                    Generate New Password
                </button>
            </div>
        </div>
    );
};

export default PasswordGenerator;
