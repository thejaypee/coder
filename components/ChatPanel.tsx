
import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, AgentIcon, SendIcon, MicrophoneIcon, SystemIcon } from './icons';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  userInput: string;
  setUserInput: (value: string) => void;
  onSend: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  currentTranscription: string;
}

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';

  if (isSystem) {
      return (
          <div className="flex justify-center items-center p-2 text-sm text-yellow-400">
              <SystemIcon />
              <span className="ml-2">{message.content}</span>
          </div>
      );
  }

  return (
    <div className={`flex items-start p-4 space-x-3 ${isUser ? 'bg-gray-800' : ''}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        {isUser ? <UserIcon /> : <AgentIcon />}
      </div>
      <div className="flex-1">
        <p className="font-semibold capitalize text-gray-300">{message.role}</p>
        <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatHistory,
  userInput,
  setUserInput,
  onSend,
  isRecording,
  onToggleRecording,
  currentTranscription
}) => {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, currentTranscription]);

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <ChatMessageItem key={index} message={msg} />
        ))}
         {currentTranscription && (
            <div className="p-4 text-gray-400 italic">
                {currentTranscription}
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
          <input
            type="text"
            className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400 px-2"
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isRecording && onSend()}
            disabled={isRecording}
          />
          <button
            onClick={onSend}
            disabled={!userInput || isRecording}
            className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
          <button
            onClick={onToggleRecording}
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <MicrophoneIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
