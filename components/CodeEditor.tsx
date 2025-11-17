
import React from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-3 bg-gray-800 border-b border-gray-700 text-sm font-medium text-gray-300">
        Code Editor
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 w-full h-full p-4 bg-[#1e1e1e] text-gray-200 font-mono text-sm resize-none focus:outline-none"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
