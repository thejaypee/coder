
import React from 'react';

interface PreviewWindowProps {
  code: string;
}

const PreviewWindow: React.FC<PreviewWindowProps> = ({ code }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-3 bg-gray-800 border-b border-gray-700 text-sm font-medium text-gray-300">
        Execution Preview
      </div>
      <iframe
        srcDoc={code}
        title="Execution Preview"
        sandbox="allow-scripts allow-modals"
        className="w-full h-full border-0 bg-white"
      />
    </div>
  );
};

export default PreviewWindow;
