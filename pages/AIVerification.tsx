import React, { useState } from 'react';
import { analyzeCertificateImage, getFastAIResponse, getComplexAIAnalysis } from '../services/geminiService';
import { Certificate } from '../types';
import { Upload, MessageSquare, Brain, Sparkles, Image as ImageIcon, Send, Loader2 } from 'lucide-react';

export const AIVerification: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'image' | 'chat'>('image');
  
  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Partial<Certificate> | null>(null);

  // Chat State
  const [prompt, setPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      // Clean base64 string
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzeCertificateImage(base64Data);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      alert('Analysis failed. Please try a clearer image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsThinking(true);
    setChatResponse('');

    try {
      if (useThinkingMode) {
        // Use gemini-3.1-pro-preview with high thinking budget
        const response = await getComplexAIAnalysis(prompt);
        setChatResponse(response);
      } else {
        // Use gemini-flash-lite-latest for fast response
        const response = await getFastAIResponse(prompt);
        setChatResponse(response);
      }
    } catch (e) {
      setChatResponse("Error processing your request.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="text-blue-600" />
          AI Intelligence Hub
        </h2>
        <p className="text-slate-500 mt-2">Powered by Gemini 3.1 Pro & Flash Lite</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-sm p-1 inline-flex border border-slate-200">
          <button
            onClick={() => setActiveMode('image')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeMode === 'image' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ImageIcon size={16} />
            Image Verification
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeMode === 'chat' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare size={16} />
            AI Assistant
          </button>
        </div>
      </div>

      {activeMode === 'image' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-800">1. Upload Certificate Photo</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-64 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden hover:bg-slate-100 transition-colors">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            
            <button
              onClick={handleAnalyzeImage}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${!selectedImage || isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing with Gemini...
                </>
              ) : "Analyze Certificate"}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-800">2. Analysis Results</h3>
            {analysisResult ? (
              <div className="space-y-4">
                 <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                   <h4 className="font-bold text-green-800 flex items-center gap-2">
                     <ShieldCheck size={20} />
                     Certificate Detected
                   </h4>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-slate-400 text-xs uppercase font-semibold">Student Name</span>
                      <span className="font-semibold text-slate-800">{analysisResult.studentName || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-slate-400 text-xs uppercase font-semibold">Certificate ID</span>
                      <span className="font-semibold text-blue-600">{analysisResult.id || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded col-span-2 border border-slate-100">
                      <span className="block text-slate-400 text-xs uppercase font-semibold">Domain</span>
                      <span className="font-semibold text-slate-800">{analysisResult.domain || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-slate-400 text-xs uppercase font-semibold">Start Date</span>
                      <span className="font-semibold text-slate-800">{analysisResult.startDate || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-slate-400 text-xs uppercase font-semibold">End Date</span>
                      <span className="font-semibold text-slate-800">{analysisResult.endDate || 'N/A'}</span>
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">* Extracted using Optical Character Recognition (AI).</p>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                <Brain size={48} className="mb-4 opacity-20" />
                <p>Upload an image to see results here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeMode === 'chat' && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 flex flex-col h-[600px]">
           <div className="bg-slate-50 p-4 border-b border-slate-200">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
               <Sparkles size={18} className="text-amber-500" />
               Ask Gemini Assistant
             </h3>
             <p className="text-xs text-slate-500 ml-6">Ask about verification processes or data integrity.</p>
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
             {chatResponse ? (
               <div className="flex flex-col space-y-2">
                  <div className="self-end bg-blue-100 text-blue-900 p-3 rounded-t-lg rounded-bl-lg max-w-[80%] text-sm">
                    {prompt}
                  </div>
                  <div className="self-start bg-white border border-slate-200 text-slate-800 p-4 rounded-t-lg rounded-br-lg max-w-[90%] shadow-sm text-sm leading-relaxed whitespace-pre-wrap">
                    <strong className="block mb-2 text-blue-600 text-xs uppercase tracking-wider flex items-center gap-1">
                      {useThinkingMode ? <Brain size={12} /> : <Sparkles size={12} />}
                      {useThinkingMode ? 'Gemini 3.1 Pro (Deep Thought)' : 'Gemini Flash Lite'}
                    </strong>
                    {chatResponse}
                  </div>
               </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic">
                  <MessageSquare size={32} className="mb-2 opacity-20" />
                  Ask me anything about certificate verification...
                </div>
             )}
           </div>

           <div className="p-4 bg-white border-t border-slate-200">
             <form onSubmit={handleChatSubmit}>
                <div className="flex items-center mb-3">
                  <label className="flex items-center text-sm text-slate-600 cursor-pointer select-none hover:text-slate-900 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={useThinkingMode} 
                      onChange={(e) => setUseThinkingMode(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mr-2"
                    />
                    Enable Thinking Mode (Complex Reasoning)
                  </label>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${useThinkingMode ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {useThinkingMode ? 'Gemini 3.1 Pro' : 'Gemini Flash Lite'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !prompt}
                    className={`px-6 py-2 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${isThinking || !prompt ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isThinking ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {isThinking ? 'Thinking...' : 'Send'}
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};
