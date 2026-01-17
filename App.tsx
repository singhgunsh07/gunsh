
import React, { useState, useCallback } from 'react';
import { LearnerProfile, LearningType, AdaptionFormat, AdaptedResponse } from './types';
import { adaptContent } from './services/gemini';
import { QuizView } from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';

const App: React.FC = () => {
  const [lessonContent, setLessonContent] = useState('');
  const [profile, setProfile] = useState<LearnerProfile>(LearnerProfile.ADHD);
  const [learningType, setLearningType] = useState<LearningType>(LearningType.CONTENT);
  const [format, setFormat] = useState<AdaptionFormat>(AdaptionFormat.HIGH_VISUAL);
  const [doubt, setDoubt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdaptedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ data: string; mimeType: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFileData({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!lessonContent && !fileData) {
      setError('Please provide lesson content or upload a document.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const adapted = await adaptContent(lessonContent, profile, learningType, format, doubt, fileData || undefined);
      setResult(adapted);
      // Smooth scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DP</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Dream Path
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-500">
            <span className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Path Maker</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Resources</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Accessibility</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Inclusive Learning, <span className="text-indigo-600 underline decoration-indigo-200">Reimagined.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Transform any technical article into a custom learning journey tailored to your specific cognitive style and goals.
          </p>
        </div>

        {/* Input Form */}
        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="space-y-8">
            {/* Content Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Content</label>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Paste the technical article or lesson notes here..."
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none text-slate-800 placeholder:text-slate-400"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">OR upload a document (PDF/Image)</div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="text-xs text-indigo-600 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            {/* Profile & Type Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Learner Profile</label>
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value as LearnerProfile)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.values(LearnerProfile).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Learning Type</label>
                <select
                  value={learningType}
                  onChange={(e) => setLearningType(e.target.value as LearningType)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.values(LearningType).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adaption Version</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as AdaptionFormat)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.values(AdaptionFormat).map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Optional Doubt */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Specific Doubt? (Optional)</label>
              <input
                type="text"
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="e.g. Can you explain the difference between X and Y?"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-2 ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Path...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Dream Path</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <div id="result-section" className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header for results */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-4 border-slate-200">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">{result.formatType}</h3>
                <p className="text-slate-500 mt-1">Customized for {profile} profile</p>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mt-4 md:mt-0">
                {learningType}
              </div>
            </div>

            {/* Answer to Doubt */}
            {result.answerToDoubt && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                <h4 className="text-amber-800 font-bold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"/></svg>
                  Answer to your question
                </h4>
                <p className="text-amber-900 leading-relaxed">{result.answerToDoubt}</p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-indigo max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {result.adaptedText.split('\n').map((line, i) => {
                   if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-extrabold text-indigo-900 mt-8 mb-6">{line.replace('# ', '')}</h1>;
                   if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-indigo-800 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                   if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-indigo-700 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                   if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <div key={i} className="flex space-x-2 my-2"><span className="text-indigo-500">•</span><span>{line.replace(/^[-*]\s*/, '')}</span></div>;
                   return <p key={i} className="mb-4">{line}</p>;
                })}
              </div>
            </div>

            {/* Interactive Components */}
            {learningType === LearningType.QUIZ && result.quiz && (
              <QuizView questions={result.quiz} />
            )}

            {learningType === LearningType.FLASHCARDS && result.flashcards && (
              <FlashcardView cards={result.flashcards} />
            )}

            {learningType === LearningType.GAME && result.gameScenario && (
              <div className="bg-slate-900 text-slate-100 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.535 5.503a1 1 0 10-1.415 1.414 6.722 6.722 0 009.9 0 1 1 0 10-1.415-1.414 4.722 4.722 0 01-7.07 0z" clipRule="evenodd"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center mr-3 text-sm">🎮</span>
                  The Knowledge Challenge
                </h3>
                <div className="relative z-10 space-y-4">
                  <p className="text-lg font-medium leading-relaxed italic text-indigo-200">
                    "Step into this scenario and apply what you've learned..."
                  </p>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result.gameScenario}
                  </div>
                  <div className="pt-8 border-t border-slate-800 mt-8 flex space-x-4">
                     <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-all">Start Adventure</button>
                     <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-all">Roleplay Context</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 pt-12 text-center text-slate-400">
        <p className="text-sm">Dream Path &copy; 2024 - Empowering every learner through technology.</p>
        <p className="text-xs mt-2">Built with Gemini API for Advanced Reasoning</p>
      </footer>
    </div>
  );
};

export default App;
