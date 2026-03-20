import React from 'react';
import { Search, History, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { FormData } from '../types';

interface UrlFetcherProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
  handleFetchUrl: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  showHistory: boolean;
  setShowHistory: (val: boolean) => void;
  history: FormData[];
  setHistory: (history: FormData[]) => void;
  setFormData: (data: FormData) => void;
}

export const UrlFetcher: React.FC<UrlFetcherProps> = ({
  inputUrl, setInputUrl, handleFetchUrl, loading, error,
  showHistory, setShowHistory, history, setHistory, setFormData
}) => {
  return (
    <Card>
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl flex justify-between items-center">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" /> Auto-Fetch Meta Tags
        </h2>
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} className="h-8 text-xs font-medium">
            <History className="w-3.5 h-3.5 mr-1.5" /> Recent
          </Button>
          {showHistory && history.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs font-semibold text-gray-500">Recent Scrapes</span>
                <button onClick={() => setHistory([])} className="text-gray-400 hover:text-red-500 transition-colors" title="Clear History">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul>
                {history.map((item, idx) => (
                  <li key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer p-3 transition-colors"
                      onClick={() => {
                        setFormData(item);
                        setInputUrl(item.url);
                        setShowHistory(false);
                      }}>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{item.title || 'Untitled'}</div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">{item.url}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 relative">
        <form onSubmit={handleFetchUrl} className="flex gap-2">
          <Input 
            placeholder="https://your-website.com" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch'}
          </Button>
        </form>
        {error && (
          <div className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>
    </Card>
  );
};
