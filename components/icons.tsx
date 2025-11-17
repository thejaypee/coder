
import React from 'react';

export const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export const AgentIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 3.5a1.5 1.5 0 013 0V5a1.5 1.5 0 01-3 0V3.5zM10 3.5a1.5 1.5 0 00-3 0V5a1.5 1.5 0 003 0V3.5z" />
    <path fillRule="evenodd" d="M9.344 11.344c-.23.23-.344.54-.344.856V13a1 1 0 001 1h.01a1 1 0 001-1v-.799c0-.316-.115-.626-.344-.856l-3-3a.5.5 0 00-.708 0l-3 3c-.23.23-.344.54-.344.856V13a1 1 0 001 1h.01a1 1 0 001-1v-.799c0-.316-.115-.626-.344-.856L5.5 10.207l1.146-1.147 1.854 1.854a.5.5 0 00.708 0l1.853-1.854 1.147 1.147-1.147 1.147z" clipRule="evenodd" />
    <path d="M4.5 9.5a.5.5 0 01.5-.5h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" />
  </svg>
);

export const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

export const MicrophoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10v-2.001a5.002 5.002 0 00-4-4.9V4a5 5 0 0110 0v3.1a5.002 5.002 0 00-4 4.9V14h-2z" clipRule="evenodd" />
  </svg>
);

export const LoadingIcon: React.FC = () => (
    <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const SystemIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);
