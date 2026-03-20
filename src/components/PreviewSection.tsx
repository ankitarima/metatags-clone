import React from 'react';
import { Search, Twitter, Facebook, Linkedin, MessageSquare, Image as ImageIcon, Slack } from 'lucide-react';
import { FormData } from '../types';

interface PreviewSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: FormData;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ activeTab, setActiveTab, formData }) => {
  const domain = formData.url.replace(/^https?:\/\//, '').split('/')[0] || 'example.com';

  return (
    <div className="sticky top-24 space-y-6">
      
      {/* Preview Nav Tabs */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 border-b border-gray-200 dark:border-gray-800">
        {[
          { id: 'google', icon: Search, label: 'Google' },
          { id: 'twitter', icon: Twitter, label: 'Twitter' },
          { id: 'facebook', icon: Facebook, label: 'Facebook' },
          { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
          { id: 'discord', icon: MessageSquare, label: 'Discord' },
          { id: 'slack', icon: Slack, label: 'Slack' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Preview Container */}
      <div className="bg-gray-100 dark:bg-[#0f1115] rounded-2xl p-4 sm:p-8 min-h-[400px] flex items-center justify-center border border-gray-200 dark:border-gray-800">
        
        {/* --- GOOGLE PREVIEW --- */}
        {activeTab === 'google' && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 w-full max-w-[600px] text-left font-sans">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                {formData.favicon ? (
                  <img src={formData.favicon} alt={`${domain} favicon`} className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; if ((e.target as HTMLImageElement).nextSibling) { ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex'; } }} />
                ) : (
                  <span className="text-xs font-bold text-gray-500">{domain.charAt(0).toUpperCase()}</span>
                )}
                <span style={{display: 'none'}} className="text-xs font-bold text-gray-500">{domain.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="text-sm text-gray-900 dark:text-gray-100">{domain}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {formData.url} <span className="text-[10px] opacity-70">▼</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 leading-tight">
              {formData.title || 'Page Title'}
            </h3>
            <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
              {formData.description || 'Provide a description to see how it looks on Google search results.'}
            </p>
          </div>
        )}

        {/* --- TWITTER PREVIEW --- */}
        {activeTab === 'twitter' && (
          <div className="w-full max-w-[500px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer shadow-sm">
            {formData.image ? (
              <div className="w-full aspect-[1.91/1] border-b border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={formData.image} 
                  alt="Twitter Card" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            ) : (
                <div className="w-full aspect-[1.91/1] border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
            )}
            <div className="p-3">
              <div className="text-[15px] text-gray-500 dark:text-gray-400 mb-0.5">{domain}</div>
              <div className="text-[15px] text-gray-900 dark:text-gray-100 font-bold truncate">
                {formData.title || 'Title'}
              </div>
              <div className="text-[15px] text-gray-500 dark:text-gray-400 truncate">
                {formData.description || 'Description'}
              </div>
            </div>
          </div>
        )}

        {/* --- FACEBOOK PREVIEW --- */}
        {activeTab === 'facebook' && (
          <div className="w-full max-w-[500px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#242526] overflow-hidden cursor-pointer shadow-sm">
            {formData.image ? (
              <div className="w-full aspect-[1.91/1] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={formData.image} 
                  alt="Facebook Link" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            ) : (
                <div className="w-full aspect-[1.91/1] bg-gray-100 dark:bg-[#242526] flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                  <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
            )}
            <div className="px-4 py-2.5 bg-[#f0f2f5] dark:bg-[#242526] border-t border-[#dadde1] dark:border-gray-700">
              <div className="text-[12px] text-[#606770] dark:text-[#b0b3b8] uppercase tracking-wide mb-1">
                {domain}
              </div>
              <div className="text-[16px] text-[#1d2129] dark:text-[#e4e6eb] font-semibold leading-tight mb-1 line-clamp-2">
                {formData.title || 'Title'}
              </div>
              <div className="text-[14px] text-[#606770] dark:text-[#b0b3b8] line-clamp-1">
                {formData.description || 'Description'}
              </div>
            </div>
          </div>
        )}

        {/* --- LINKEDIN PREVIEW --- */}
        {activeTab === 'linkedin' && (
          <div className="w-full max-w-[520px] bg-white dark:bg-[#1d2226] overflow-hidden cursor-pointer border border-[#00000026] dark:border-[#ffffff33]">
            {formData.image ? (
              <div className="w-full aspect-[1.91/1] overflow-hidden bg-[#f3f2ef] dark:bg-[#38434f]">
                <img 
                  src={formData.image} 
                  alt="LinkedIn Post" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            ) : (
                <div className="w-full aspect-[1.91/1] bg-[#f3f2ef] dark:bg-[#38434f] flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                </div>
            )}
            <div className="p-3 bg-[#f3f2ef] dark:bg-[#1d2226]">
              <div className="text-[14px] text-[#000000e6] dark:text-[#ffffff] font-semibold leading-[20px] truncate mb-[2px]">
                {formData.title || 'Title'}
              </div>
              <div className="text-[12px] text-[#00000099] dark:text-[#ffffff99] truncate">
                {domain}
              </div>
            </div>
          </div>
        )}

          {/* --- DISCORD PREVIEW --- */}
          {activeTab === 'discord' && (
          <div className="w-full max-w-[450px] bg-[#313338] text-[#dbdee1] rounded-lg p-4 font-sans text-left border border-transparent">
            <div className="flex border-l-[4px] border-[#1e1f22] pl-3 py-1">
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-[12px] font-bold text-[#b5bac1] mb-1 hover:underline cursor-pointer">
                  {formData.title ? formData.title.split(' | ')[0] : 'Website Name'}
                </div>
                <div className="text-[16px] font-semibold text-[#00a8fc] hover:underline cursor-pointer leading-tight mb-2 truncate">
                  {formData.title || 'Page Title'}
                </div>
                <div className="text-[14px] leading-[1.25] text-[#dbdee1] mb-3 line-clamp-3">
                  {formData.description || 'Provide a description to see the Discord embed preview.'}
                </div>
                {formData.image && (
                  <div className="max-w-full rounded-lg overflow-hidden block">
                    <img 
                      src={formData.image} 
                      alt="Discord Embed" 
                      className="max-h-[300px] max-w-[400px] w-auto h-auto object-cover rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SLACK PREVIEW --- */}
        {activeTab === 'slack' && (
          <div className="w-full max-w-[500px] text-left font-sans text-[15px] p-4 bg-white dark:bg-[#1a1d21] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex border-l-[4px] border-[#dddddd] dark:border-[#3e4246] pl-3 py-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                  {formData.favicon && (
                     <img src={formData.favicon} alt="favicon" className="w-4 h-4 object-contain rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  )}
                  <span>{formData.title ? formData.title.split(' | ')[0] : 'Website'}</span>
                </div>
                <div className="font-bold text-[#1264a3] dark:text-[#1d9bd1] hover:underline cursor-pointer leading-tight mb-1 truncate">
                  {formData.title || 'Page Title'}
                </div>
                <div className="leading-[1.46] text-gray-800 dark:text-gray-300 line-clamp-3 mb-2 text-[14px]">
                  {formData.description || 'Provide a description to see the Slack unfurl preview interactively.'}
                </div>
                {formData.image && (
                  <div className="max-w-full rounded-lg overflow-hidden block border border-gray-200 dark:border-gray-800 mt-2">
                    <img 
                      src={formData.image} 
                      alt="Slack Unfurl" 
                      className="max-h-[350px] max-w-full w-auto h-auto object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
