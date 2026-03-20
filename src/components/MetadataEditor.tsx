import React from 'react';
import { LinkIcon, MessageSquare, Image as ImageIcon, Sparkles, RefreshCw, Info, Upload } from 'lucide-react';
import { Card } from './ui/Card';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { FormData } from '../types';

interface MetadataEditorProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAIOptimize: (field: 'title' | 'description') => Promise<void>;
  isGeneratingAI: { title: boolean; description: boolean };
  getProgressColor: (length: number, max: number, optimal: number) => string;
}

export const MetadataEditor: React.FC<MetadataEditorProps> = ({
  formData, setFormData, handleInputChange, handleAIOptimize, isGeneratingAI, getProgressColor
}) => {
  const titleLength = formData.title.length;
  const descLength = formData.description.length;

  const InfoTooltip = ({ text }: { text: string }) => (
    <div className="relative group flex items-center ml-1.5">
      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-normal leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
      </div>
    </div>
  );

  return (
    <Card>
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="font-semibold">Edit Metadata</h2>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Title Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-500" /> Title
              <InfoTooltip text="Optimal length is around 50-60 characters. This acts as the main blue link shown in Google search results." />
            </Label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAIOptimize('title')} 
                disabled={isGeneratingAI.title}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 px-2 py-1 rounded-md"
              >
                {isGeneratingAI.title ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Optimize
              </button>
              <span className={`text-xs ${titleLength > 60 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {titleLength} / 60
              </span>
            </div>
          </div>
          <Input 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            placeholder="Page Title" 
          />
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getProgressColor(titleLength, 60, 50)}`} 
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" /> Description
              <InfoTooltip text="Optimal length is under 160 characters. This acts as the short summary shown under your title in search results." />
            </Label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAIOptimize('description')} 
                disabled={isGeneratingAI.description}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 px-2 py-1 rounded-md"
              >
                {isGeneratingAI.description ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Optimize
              </button>
              <span className={`text-xs ${descLength > 160 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {descLength} / 160
              </span>
            </div>
          </div>
          <Textarea 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Write a compelling description..."
            rows={4}
          />
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getProgressColor(descLength, 160, 120)}`} 
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* Image Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gray-500" /> Image URL
            <InfoTooltip text="Recommended dimension is 1200x630. This is the visual image displayed when sharing the link on platforms like Twitter/X, Discord, or LinkedIn." />
          </Label>
          <div className="flex gap-2">
            <Input 
              name="image" 
              value={formData.image} 
              onChange={handleInputChange} 
              placeholder="https://.../image.jpg" 
              className="flex-1"
            />
            <div className="relative overflow-hidden rounded-md">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, image: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button type="button" variant="outline" className="px-4 gap-2 bg-white dark:bg-gray-950/50">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload</span>
              </Button>
            </div>
          </div>
          {formData.image && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-32 relative group">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/e2e8f0/64748b?text=Invalid+Image+URL' }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
