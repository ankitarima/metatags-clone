import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check, 
  MessageSquare,
  Moon, 
  Sun,
  RefreshCw,
  AlertCircle,
  Globe,
  Sparkles,
  ChevronDown,
  History,
  Trash2,
  Code
} from 'lucide-react';

// --- UI Components (Shadcn UI inspired) ---

const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 shadow-sm ${className}`}>
    {children}
  </div>
);

const Label = ({ className = '', children }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button = ({ className = '', variant = 'default', size = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm',
    outline: 'border border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50 text-gray-600 dark:text-gray-400',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    icon: 'h-10 w-10',
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Main Application ---

export default function App() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [activeTab, setActiveTab] = useState('google');

  const [formData, setFormData] = useState({
    url: 'https://example.com/awesome-product',
    title: 'The Ultimate AI Productivity Tool | Acme Corp',
    description: 'Boost your daily workflow with our cutting-edge AI assistant. Designed for modern teams who want to accomplish more in less time. Try it free today.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    favicon: '',
  });

  const [inputUrl, setInputUrl] = useState('');

  // New States for Phase 1
  const [exportFormat, setExportFormat] = useState('html');
  const [isGeneratingAI, setIsGeneratingAI] = useState({ title: false, description: false });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('metatags_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Handle local storage for history
  useEffect(() => {
    localStorage.setItem('metatags_history', JSON.stringify(history));
  }, [history]);

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Fetch URL Metadata via CORS Proxy
  const handleFetchUrl = async (e) => {
    e.preventDefault();
    if (!inputUrl) return;

    let targetUrl = inputUrl.trim();
    // Auto-prepend https:// if missing to prevent protocol errors
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
      setInputUrl(targetUrl);
    }

    setLoading(true);
    setError('');

    try {
      let html = '';
      
      // Attempt 1: Using AllOrigins proxy
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Primary proxy failed');
        const data = await response.json();
        html = data.contents;
      } catch (err1) {
        console.warn("Primary proxy failed, attempting fallback...", err1);
        
        // Attempt 2: Fallback to CodeTabs proxy (returns raw HTML)
        const fallbackProxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
        const fallbackResponse = await fetch(fallbackProxyUrl);
        if (!fallbackResponse.ok) throw new Error('Fallback proxy failed');
        html = await fallbackResponse.text();
      }

      if (!html) throw new Error("Could not fetch page content.");
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const getMeta = (name, property) => {
        return doc.querySelector(`meta[name="${name}"]`)?.content || 
               doc.querySelector(`meta[property="${property}"]`)?.content || 
               doc.querySelector(`meta[itemprop="${name}"]`)?.content || '';
      };

      const fetchedTitle = doc.querySelector('title')?.innerText || getMeta('title', 'og:title');
      const fetchedDesc = getMeta('description', 'og:description');
      const fetchedImage = getMeta('image', 'og:image') || getMeta('twitter:image', 'twitter:image');
      
      // Favicon Parsing
      let absoluteFavicon = '';
      const faviconHref = doc.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                          doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
      if (faviconHref) {
        try {
          absoluteFavicon = new URL(faviconHref, targetUrl).href;
        } catch (e) {
          console.warn("Could not parse favicon URL", e);
        }
      }

      if (!fetchedTitle && !fetchedDesc) {
        setError("Could not find meta tags on this page.");
      }

      const newFormData = {
        url: targetUrl,
        title: fetchedTitle || '',
        description: fetchedDesc || '',
        image: fetchedImage || '',
        favicon: absoluteFavicon || '',
      };

      setFormData(prev => ({ ...prev, ...newFormData }));

      setHistory(prev => {
        const filtered = prev.filter(item => item.url !== targetUrl);
        return [newFormData, ...filtered].slice(0, 5);
      });

    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch URL. Check if the URL is accessible or blocked by CORS/Adblockers.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIOptimize = async (field) => {
    setIsGeneratingAI(prev => ({ ...prev, [field]: true }));
    // Mock AI call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (field === 'title') {
      const suggestions = [
        `🚀 ${formData.title} - The Ultimate Guide`,
        `Top 10 Secrets for ${formData.title}`,
        `${formData.title} | Boost Your Results Today`
      ];
      setFormData(prev => ({ ...prev, title: suggestions[Math.floor(Math.random() * suggestions.length)] }));
    } else {
      const suggestions = [
        `✨ Master ${formData.title} with our definitive guide. Discover proven strategies and tools that will transform your results. Start learning today!`,
        `Unlock the full potential of your business with our cutting-edge solutions. Join thousands of satisfied customers who have already seen the difference.`,
        `Looking for the best way to handle your workflows? We provide the insights and tools you need to succeed. Learn more inside.`
      ];
      setFormData(prev => ({ ...prev, description: suggestions[Math.floor(Math.random() * suggestions.length)] }));
    }
    setIsGeneratingAI(prev => ({ ...prev, [field]: false }));
  };

  // Generate HTML Code
  const generateHTMLCode = () => {
    const { title, description, image, url } = formData;
    
    if (exportFormat === 'nextjs') {
      return `export const metadata = {
  title: '${title}',
  description: '${description}',
  openGraph: {
    title: '${title}',
    description: '${description}',
    url: '${url}',
    type: 'website',
    images: [
      {
        url: '${image}',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: '${description}',
    images: ['${image}'],
  },
};`;
    } else if (exportFormat === 'helmet') {
      return `import { Helmet } from 'react-helmet';

export default function SEO() {
  return (
    <Helmet>
      <title>${title}</title>
      <meta name="description" content="${description}" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="${url}" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    </Helmet>
  );
}`;
    }

    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateHTMLCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SEO Indicators
  const getProgressColor = (length, max, optimal) => {
    if (length === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (length <= optimal) return 'bg-green-500';
    if (length <= max) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const titleLength = formData.title.length;
  const descLength = formData.description.length;
  const domain = formData.url.replace(/^https?:\/\//, '').split('/')[0] || 'example.com';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">MetaTags<span className="text-blue-600">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Editor */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Fetch URL Section */}
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

            {/* Manual Edit Section */}
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
                  </Label>
                  <Input 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="https://.../image.jpg" 
                  />
                  {formData.image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-32 relative group">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/1200x630/e2e8f0/64748b?text=Invalid+Image+URL' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Generated Code */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold flex items-center gap-2 text-sm">
                    <Code className="w-4 h-4 text-blue-600" /> Output
                  </h2>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md py-1 px-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer text-gray-700 dark:text-gray-300"
                    style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right .25rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
                  >
                    <option value="html">Raw HTML</option>
                    <option value="nextjs">Next.js (App Router)</option>
                    <option value="helmet">React Helmet</option>
                  </select>
                </div>
                <Button size="sm" variant="outline" onClick={handleCopyCode} className="h-8 gap-1.5 bg-white dark:bg-gray-950">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="p-4 bg-gray-900 text-gray-100 dark:bg-black font-mono text-xs overflow-x-auto">
                <pre><code>{generateHTMLCode()}</code></pre>
              </div>
            </Card>
            
          </div>

          {/* Right Column: Previews */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Preview Nav Tabs */}
              <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 border-b border-gray-200 dark:border-gray-800">
                {[
                  { id: 'google', icon: Search, label: 'Google' },
                  { id: 'twitter', icon: Twitter, label: 'Twitter' },
                  { id: 'facebook', icon: Facebook, label: 'Facebook' },
                  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                  { id: 'discord', icon: MessageSquare, label: 'Discord' },
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
                          <img src={formData.favicon} alt={`${domain} favicon`} className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
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
                          onError={(e) => { e.target.style.display = 'none' }}
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
                          onError={(e) => { e.target.style.display = 'none' }}
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
                          onError={(e) => { e.target.style.display = 'none' }}
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
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}