
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardViewProps {
  cards: Flashcard[];
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  if (!cards.length) return null;

  return (
    <div className="flex flex-col items-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4 w-full justify-between max-w-lg">
        <h3 className="text-2xl font-bold text-slate-800">Learning Flashcards</h3>
        <span className="text-sm font-medium text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div 
        className="relative w-full max-w-lg h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full flashcard-inner transition-transform duration-500 shadow-xl rounded-3xl ${isFlipped ? 'flashcard-flipped' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 bg-white border-4 border-indigo-100 rounded-3xl backface-hidden flex items-center justify-center p-8 text-center">
            <p className="text-2xl font-bold text-slate-800 leading-tight">{card.front}</p>
            <div className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-indigo-400">Question / Concept</div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 bg-indigo-600 rounded-3xl backface-hidden rotate-y-180 flex items-center justify-center p-8 text-center text-white">
            <p className="text-xl font-medium leading-relaxed">{card.back}</p>
            <div className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-indigo-200">The Explanation</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="p-4 bg-white shadow-md hover:shadow-lg rounded-full text-indigo-600 transition-all border border-slate-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="p-4 bg-white shadow-md hover:shadow-lg rounded-full text-indigo-600 transition-all border border-slate-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <p className="text-slate-400 text-sm font-medium">Click card to reveal answer</p>
    </div>
  );
};
