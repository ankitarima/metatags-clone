import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlFetcher } from './components/UrlFetcher';
import { MetadataEditor } from './components/MetadataEditor';
import { CodeExporter } from './components/CodeExporter';
import { PreviewSection } from './components/PreviewSection';
import { FormData } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('google');
  
  const [formData, setFormData] = useState<FormData>({
    url: 'https://example.com/awesome-product',
    title: 'The Ultimate AI Productivity Tool | Acme Corp',
    description: 'Boost your daily workflow with our cutting-edge AI assistant. Designed for modern teams who want to accomplish more in less time. Try it free today.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    favicon: '',
  });

  const [inputUrl, setInputUrl] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('html');
  const [isGeneratingAI, setIsGeneratingAI] = useState<{ title: boolean; description: boolean }>({ title: false, description: false });
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  const [history, setHistory] = useState<FormData[]>(() => {
    try {
      const saved = localStorage.getItem('metatags_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('metatags_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;

    let targetUrl = inputUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
      setInputUrl(targetUrl);
    }

    setLoading(true);
    setError('');

    try {
      let html = '';
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Primary proxy failed');
        const data = await response.json();
        html = data.contents;
      } catch (err1) {
        console.warn("Primary proxy failed, attempting fallback...", err1);
        const fallbackProxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
        const fallbackResponse = await fetch(fallbackProxyUrl);
        if (!fallbackResponse.ok) throw new Error('Fallback proxy failed');
        html = await fallbackResponse.text();
      }

      if (!html) throw new Error("Could not fetch page content.");
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const getMeta = (name: string, property: string): string => {
        return (doc.querySelector(`meta[name="${name}"]`) as HTMLMetaElement)?.content || 
               (doc.querySelector(`meta[property="${property}"]`) as HTMLMetaElement)?.content || 
               (doc.querySelector(`meta[itemprop="${name}"]`) as HTMLMetaElement)?.content || '';
      };

      const fetchedTitle = doc.querySelector('title')?.innerText || getMeta('title', 'og:title');
      const fetchedDesc = getMeta('description', 'og:description');
      const fetchedImage = getMeta('image', 'og:image') || getMeta('twitter:image', 'twitter:image');
      
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

      const newFormData: FormData = {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIOptimize = async (field: 'title' | 'description') => {
    setIsGeneratingAI(prev => ({ ...prev, [field]: true }));
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

  const generateHTMLCode = (): string => {
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
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
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

  const getProgressColor = (length: number, max: number, optimal: number): string => {
    if (length === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (length <= optimal) return 'bg-green-500';
    if (length <= max) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <UrlFetcher 
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
              handleFetchUrl={handleFetchUrl}
              loading={loading}
              error={error}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              history={history}
              setHistory={setHistory}
              setFormData={setFormData}
            />
            
            <MetadataEditor 
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              handleAIOptimize={handleAIOptimize}
              isGeneratingAI={isGeneratingAI}
              getProgressColor={getProgressColor}
            />

            <CodeExporter 
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              generateHTMLCode={generateHTMLCode}
              handleCopyCode={handleCopyCode}
              copied={copied}
            />
          </div>

          <div className="lg:col-span-7">
            <PreviewSection 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formData={formData}
            />
          </div>
          
        </div>
      </main>
    </div>
  );
}