
import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Gamepad2, 
  Info, 
  RefreshCcw, 
  Download,
  Terminal,
  BrainCircuit,
  Image as ImageIcon,
  ChevronDown,
  Zap,
  Smile,
  Target,
  Maximize2
} from 'lucide-react';
import { generatePuzzleLogic, generatePuzzleImage } from './services/geminiService';
import { GenerationResult } from './types';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLogic, setShowLogic] = useState(false);

  const handleGenerate = async (isAuto: boolean) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowLogic(false);
    
    try {
      setLoadingStage('CONCOCTING PUZZLE...');
      const logic = await generatePuzzleLogic(isAuto ? undefined : input);
      
      setLoadingStage('PAINTING ILLUSTRATION...');
      const imageUrl = await generatePuzzleImage(logic.imagePrompt);
      
      setResult({ logic, imageUrl });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `puzzle-${result.logic.answer}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center p-6 md:p-16">
      
      {/* Floating Background Shapes */}
      <div className="shape shape-circle w-32 h-32 bg-[#FF4B4B] top-20 -left-16 floating opacity-80"></div>
      <div className="shape shape-rect w-40 h-40 bg-[#007AFF] bottom-20 -right-20 floating opacity-80" style={{animationDelay: '1s'}}></div>
      <div className="shape w-24 h-24 bg-[#FFD600] top-1/2 -right-12 floating opacity-80" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', animationDelay: '2s'}}></div>
      <div className="shape shape-circle w-20 h-20 bg-[#00C853] bottom-40 left-10 floating opacity-80" style={{animationDelay: '1.5s'}}></div>

      {/* Header Section */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-16 gap-8 relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 mb-4 bg-white border-[3px] border-black px-4 py-1 rounded-full shadow-[3px_3px_0_black]">
            <Zap className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
            <span className="text-[10px] font-bold tracking-widest uppercase">CREATIVE LAB V3.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display leading-[0.9] tracking-tight mb-4">
            MEME <span className="text-[#FF4B4B]">PUZZLE</span><br/>MASTER
          </h1>
          <p className="text-gray-600 font-medium text-lg max-w-md">
            The ultimate visual riddle generator. <br/>
            Turn your <span className="text-black font-bold italic underline decoration-[#007AFF] decoration-2 underline-offset-4">concepts</span> into clever illustrations.
          </p>
        </div>
        
        <div className="hidden md:flex gap-4">
           <div className="gj-card p-4 rounded-3xl transform -rotate-3 hover:rotate-0 transition-all">
              <ImageIcon className="w-8 h-8 mb-2" />
              <div className="w-16 h-2 bg-black/10 rounded-full mb-1"></div>
              <div className="w-10 h-2 bg-black/10 rounded-full"></div>
           </div>
           <div className="gj-card p-4 rounded-3xl transform rotate-6 hover:rotate-0 transition-all bg-[#00C853]">
              <Sparkles className="w-8 h-8 mb-2 text-white" />
              <div className="w-16 h-2 bg-white/20 rounded-full mb-1"></div>
              <div className="w-10 h-2 bg-white/20 rounded-full"></div>
           </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Side: Controls (4 columns) */}
        <section className="lg:col-span-5 space-y-8">
          <div className="gj-card rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#007AFF] p-2 rounded-xl border-2 border-black">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Experiment Room</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Define Puzzle Key</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter keywords (e.g. Cat, Pizza)..."
                    className="w-full gj-input rounded-2xl text-lg font-medium placeholder-gray-400 focus:ring-0 focus:border-[#FF4B4B] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={loading || !input.trim()}
                  onClick={() => handleGenerate(false)}
                  className="gj-btn py-4 bg-[#FF4B4B] text-white rounded-2xl disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  GENERATE
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate(true)}
                  className="gj-btn py-4 bg-[#00C853] text-white rounded-2xl disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  RANDOM
                </button>
              </div>
            </div>

            <div className="bg-[#FFD600] rounded-3xl p-6 border-[3px] border-black shadow-[4px_4px_0_black]">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-xl border-2 border-black mt-1">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-md font-bold uppercase mb-1">PRO TIPS</h4>
                  <p className="text-xs font-bold leading-tight">
                    Keep clues simple. Let the AI handle the visual puns. Google-style illustrations ensure clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="gj-card rounded-[2rem] p-6 border-[3px] animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <BrainCircuit className="w-6 h-6 text-[#FF4B4B]" />
                    <h3 className="font-bold text-lg">PUZZLE LOGIC</h3>
                 </div>
                 <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold">SOLVED</div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-4 border-2 border-black/5">
                <p className="text-[#FF4B4B] font-bold text-xl mb-1 uppercase tracking-tighter">ANS: {result.logic.answer}</p>
                <p className="text-gray-600 text-sm font-medium leading-relaxed italic">{result.logic.analysis}</p>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Output Frame (7 columns) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md aspect-[9/16] gj-card rounded-[2.5rem] overflow-hidden relative flex flex-col group">
            {/* Mock Browser Header */}
            <div className="browser-header">
              <div className="dot bg-[#FF4B4B]"></div>
              <div className="dot bg-[#FFD600]"></div>
              <div className="dot bg-[#00C853]"></div>
              <div className="flex-grow bg-gray-100 h-3 rounded-full mx-4 border border-black/10"></div>
            </div>

            <div className="flex-grow relative flex items-center justify-center bg-[#FAFAFA]">
              {loading ? (
                <div className="flex flex-col items-center text-center px-8 relative z-10">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-[6px] border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Smile className="w-8 h-8 text-[#FFD600]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold uppercase italic">{loadingStage}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">ILLUSTRATING MAGIC...</p>
                </div>
              ) : result ? (
                <div className="w-full h-full relative p-6">
                  <div className="w-full h-full border-2 border-black/10 rounded-3xl overflow-hidden shadow-inner">
                    <img 
                      src={result.imageUrl} 
                      alt="Puzzle Illustration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-[2rem] border-[3px] border-black shadow-[6px_6px_0_black] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <h4 className="font-bold text-xl mb-4 text-center">GRAB THIS DESIGN?</h4>
                      <button 
                        onClick={downloadImage}
                        className="w-full gj-btn py-4 bg-[#FF4B4B] text-white rounded-xl flex items-center justify-center gap-3"
                      >
                        <Download className="w-5 h-5" />
                        DOWNLOAD
                      </button>
                    </div>
                  </div>
                  
                  {/* Floating labels in UI */}
                  <div className="absolute top-10 left-10 bg-[#FFD600] border-2 border-black px-4 py-1 rounded-full text-[10px] font-bold uppercase shadow-[2px_2px_0_black]">
                    CLUE 01
                  </div>
                  <div className="absolute bottom-10 right-10 bg-[#007AFF] border-2 border-black px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase shadow-[2px_2px_0_black]">
                    LVL. 99
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center px-12">
                  <div className="bg-gray-100 p-8 rounded-[3rem] mb-6 border-2 border-black/5 border-dashed">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                  <p className="text-2xl font-bold uppercase opacity-30 tracking-tight">
                    NO CANVAS YET
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                    GENERATE ON THE LEFT TO START
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {result && (
            <div className="mt-8 flex items-center gap-4 animate-in fade-in duration-1000">
              <div className="bg-white border-2 border-black px-4 py-1 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RENDERED IN 9:16</span>
              </div>
              <button className="gj-btn p-2 bg-white rounded-full">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 border-t-2 border-black/5 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © 2024 MEME LAB · POWERED BY <span className="text-black">GEMINI AI</span>
          </p>
        </div>
        <div className="flex gap-8">
          {['TOS', 'PRIVACY', 'DOCS'].map(link => (
            <a key={link} href="#" className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em]">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
