import React, { useState } from 'react';
import { Code, Check, Copy, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface CodeExporterProps {
  exportFormat: string;
  setExportFormat: (val: string) => void;
  generateHTMLCode: () => string;
  handleCopyCode: () => void;
  copied: boolean;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({
  exportFormat, setExportFormat, generateHTMLCode, handleCopyCode, copied
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full gap-2 text-md h-12">
        <Code className="w-5 h-5" /> Export Generated Tags
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <Card className="overflow-hidden flex flex-col flex-1 border-gray-200 dark:border-gray-800">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/80">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h2 className="font-bold flex items-center gap-2 text-lg">
                    <Code className="w-5 h-5 text-blue-600" /> Export Code
                  </h2>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md py-1.5 px-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer text-gray-700 dark:text-gray-300"
                    style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right .5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
                  >
                    <option value="html">Raw HTML</option>
                    <option value="nextjs">Next.js (App Router)</option>
                    <option value="helmet">React Helmet</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="default" onClick={handleCopyCode} className="h-9 gap-1.5 min-w[100px]">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-900 text-gray-100 dark:bg-black font-mono text-sm overflow-x-auto overflow-y-auto max-h-[65vh]">
                <pre><code>{generateHTMLCode()}</code></pre>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
