import React, { useState, useEffect, useRef } from 'react';

const ConfettiPiece = ({ id }: { id: number }) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const style: React.CSSProperties = {
        position: 'absolute',
        width: `${Math.random() * 8 + 4}px`,
        height: `${Math.random() * 8 + 4}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        top: `${-20}%`,
        left: `${Math.random() * 100}%`,
        opacity: 1,
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fall-${id} 5s linear forwards`,
    };
    const keyframes = `
        @keyframes fall-${id} {
            to {
                top: 120%;
                transform: rotate(${Math.random() * 360 + 360}deg);
                opacity: 0;
            }
        }
    `;
    return (
        <>
            <style>{keyframes}</style>
            <div style={style}></div>
        </>
    );
};


const RandomNamePicker: React.FC = () => {
    const [names, setNames] = useState('');
    const [winner, setWinner] = useState<string | null>(null);
    const [isPicking, setIsPicking] = useState(false);
    const [displayedName, setDisplayedName] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const namesList = names.split('\n').map(n => n.trim()).filter(Boolean);

    const startPicking = () => {
        if (namesList.length < 2) return;
        setIsPicking(true);
        setWinner(null);
        setShowConfetti(false);
        let shuffleCount = 0;

        intervalRef.current = window.setInterval(() => {
            setDisplayedName(namesList[Math.floor(Math.random() * namesList.length)]);
            shuffleCount++;
            if (shuffleCount > 20) { // 2 seconds of shuffling
                stopPicking();
            }
        }, 100);
    };

    const stopPicking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const finalWinner = namesList[Math.floor(Math.random() * namesList.length)];
        setWinner(finalWinner);
        setDisplayedName(finalWinner);
        setIsPicking(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };
    
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="space-y-6">
             <textarea
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
                placeholder="Enter names, one per line..."
            ></textarea>

            <div className="text-center">
                <button
                    onClick={startPicking}
                    disabled={isPicking || namesList.length < 2}
                    className="px-8 py-3 bg-primary text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isPicking ? 'Picking...' : 'Pick a Winner'}
                </button>
            </div>
            
            <div className="relative h-24 mt-6 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden">
                {showConfetti && Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}
                <span className={`text-4xl font-bold transition-all duration-300 ${winner ? 'text-green-600 scale-125' : 'text-primary'}`}>
                    {isPicking || winner ? displayedName : '?'}
                </span>
            </div>
        </div>
    );
};

export default RandomNamePicker;
