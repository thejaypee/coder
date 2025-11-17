
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ChatMessage } from './types';
import { generateCodeFromText, connectLive } from './services/geminiService';
import ChatPanel from './components/ChatPanel';
import CodeEditor from './components/CodeEditor';
import PreviewWindow from './components/PreviewWindow';
import { LoadingIcon } from './components/icons';

const INITIAL_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-800 text-white flex items-center justify-center h-screen font-sans">
  <div class="text-center">
    <h1 class="text-5xl font-bold mb-4">Conversational Coder</h1>
    <p class="text-xl text-gray-300">Tell me what to build, or give me instructions to change this page.</p>
    <p class="text-lg text-gray-400 mt-2">Try saying "make the background dark blue and the title yellow".</p>
  </div>
</body>
</html>`;

const App: React.FC = () => {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'agent', content: "Hello! I'm your AI coding assistant. Type a message or hold the microphone button to tell me what to build or change." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');

  const liveSession = useRef<{ close: () => void } | null>(null);

  const handleCodeGeneration = useCallback(async (prompt: string, isVoiceInput: boolean = false) => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentTranscription('');

    try {
      const newCode = await generateCodeFromText(prompt, code);
      setCode(newCode);
      const agentMessage: ChatMessage = { role: 'agent', content: isVoiceInput ? "OK, I've updated the code based on your voice command." : "I've updated the code for you." };
      setChatHistory(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error generating code:", error);
      const errorMessage: ChatMessage = { role: 'agent', content: "Sorry, I encountered an error. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleSendText = () => {
    handleCodeGeneration(userInput);
    setUserInput('');
  };
  
  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      liveSession.current?.close();
      liveSession.current = null;
      setIsRecording(false);
      // Process the final transcription if any
      if (currentTranscription.trim()) {
        handleCodeGeneration(currentTranscription, true);
      }
    } else {
      try {
        setChatHistory(prev => [...prev, {role: 'system', content: 'Listening...'}]);
        liveSession.current = await connectLive({
          onTranscriptionUpdate: (text) => {
            setCurrentTranscription(prev => prev + text);
          },
          onTurnComplete: (fullTranscription) => {
            handleCodeGeneration(fullTranscription, true);
          },
          onClose: () => {
            // Remove "Listening..." message
             setChatHistory(prev => prev.filter(m => m.role !== 'system'));
          },
          onError: (error) => {
            console.error('Live session error:', error);
            setChatHistory(prev => [...prev, { role: 'agent', content: "Sorry, there was an issue with the voice connection." }]);
            setIsRecording(false);
          },
        });
        setIsRecording(true);
      } catch (error) {
         console.error('Failed to start recording:', error);
         setChatHistory(prev => [...prev, { role: 'agent', content: "Could not start recording. Please check microphone permissions." }]);
      }
    }
  }, [isRecording, currentTranscription, handleCodeGeneration]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      liveSession.current?.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <LoadingIcon />
            <p className="mt-4 text-lg">Agent is thinking...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full md:w-1/3 border-r border-gray-700">
        <ChatPanel 
          chatHistory={chatHistory} 
          userInput={userInput}
          setUserInput={setUserInput}
          onSend={handleSendText}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          currentTranscription={currentTranscription}
        />
      </div>
      <div className="hidden md:flex flex-col w-1/3 border-r border-gray-700">
        <CodeEditor code={code} setCode={setCode} />
      </div>
      <div className="hidden md:flex flex-col w-1/3">
        <PreviewWindow code={code} />
      </div>
    </div>
  );
};

export default App;
