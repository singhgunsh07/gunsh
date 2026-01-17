
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (showResults) return;
    const newAnswers = [...userAnswers];
    newAnswers[qIdx] = oIdx;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, ans, idx) => {
      return ans === questions[idx].correctIndex ? score + 1 : score;
    }, 0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-800">Knowledge Quiz</h3>
        {showResults && (
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold">
            Score: {calculateScore()} / {questions.length}
          </div>
        )}
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <p className="text-lg font-semibold mb-4 text-slate-800">{qIdx + 1}. {q.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, oIdx) => {
              const isSelected = userAnswers[qIdx] === oIdx;
              const isCorrect = q.correctIndex === oIdx;
              const isWrong = isSelected && !isCorrect;

              let btnClass = "p-4 rounded-xl text-left border-2 transition-all ";
              if (!showResults) {
                btnClass += isSelected 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600";
              } else {
                if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-700";
                else if (isWrong) btnClass += "border-red-500 bg-red-50 text-red-700";
                else btnClass += "border-slate-100 bg-slate-50 text-slate-400";
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(qIdx, oIdx)}
                  className={btnClass}
                  disabled={showResults}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {showResults && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!showResults && (
        <button
          onClick={() => setShowResults(true)}
          disabled={userAnswers.includes(-1)}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Check Results
        </button>
      )}
    </div>
  );
};
