{
  "name": "ai-news-portal",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://piyalidasofficial2025-source.github.io/ai-news-portal",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  }
}

// public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Audio Visual Global News Portal" />
    <title>AI Audio Visual News Portal</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

// src/App.js
import React, { useEffect, useState } from 'react';

export default function App() {
  const [news, setNews] = useState([]);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('—');

  const liveStreams = {
    en: 'https://www.bbc.com/news/av/embed/p08t2g54/53999932',
    hi: 'https://www.tv9hindi.com/live-tv',
    ta: 'https://www.24x7liveindia.com/embed/puthiyathalaimurai',
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      let articles = [];

      if (lang === 'en') {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/rss.xml');
        const data = await res.json();
        articles = data.items?.slice(0, 10) || [];
      } else {
        const res = await fetch(`https://newsdata.io/api/1/news?apikey=pub_fefd285deecd4e7cbb8dd38b5923adb1&language=${lang}`);
        const data = await res.json();
        if (data.results && data.results.length) {
          articles = data.results.slice(0, 10);
        } else {
          const res2 = await fetch('https://inshortsapi.vercel.app/news?category=national');
          const fallback = await res2.json();
          articles = fallback.data.slice(0, 10).map((n) => ({ title: n.title, description: n.content, link: n.url }));
        }
      }

      if (!articles.length) throw new Error('No news found');
      setNews(articles);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const speak = (title, description) => {
    const fullText = `${title}. ${description || ''}`;
    const utter = new SpeechSynthesisUtterance(fullText);
    if (lang === 'hi') utter.lang = 'hi-IN';
    else if (lang === 'ta') utter.lang = 'ta-IN';
    else utter.lang = 'en-US';

    utter.rate = lang === 'ta' ? 0.85 : 1.0;
    utter.pitch = lang === 'ta' ? 0.9 : 1.0;
    utter.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil'));
    if (tamilVoice) utter.voice = tamilVoice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    fetchNews();
    const interval = setInterval(fetchNews, 3600000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl font-bold">AI Audio-Visual Global News Portal</h1>
        <p>Live, multilingual, and hourly updated</p>
        <div className="mt-3">
          <button onClick={() => setLang('en')} className={`px-3 py-1 ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>English</button>
          <button onClick={() => setLang('hi')} className={`px-3 py-1 ${lang === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>हिन्दी</button>
          <button onClick={() => setLang('ta')} className={`px-3 py-1 ${lang === 'ta' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>தமிழ்</button>
          <button onClick={fetchNews} className="ml-3 bg-green-600 px-3 py-1 rounded text-white">🔄 Refresh</button>
        </div>
      </header>

      {error && <div className="bg-red-500 text-white text-center p-2">{error}</div>}

      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2 bg-white rounded-2xl p-4 shadow">
          {loading ? <p>Loading...</p> : news.map((n, i) => (
            <div key={i} className="border-b pb-3 mb-3">
              <h3 className="font-bold text-lg">{n.title}</h3>
              <p>{n.description}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => speak(n.title, n.description)} className="bg-blue-500 text-white px-2 py-1 rounded">🔊 Listen Full</button>
                {n.link && <a href={n.link} target="_blank" className="text-blue-700 underline">Read More</a>}
              </div>
            </div>
          ))}
        </section>

        <aside className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Live Video</h2>
          <iframe width="100%" height="250" src={liveStreams[lang]} allowFullScreen title="Live"></iframe>
          <p className="mt-2 text-sm text-center">Last updated: {lastUpdated}</p>
        </aside>
      </main>
    </div>
  );
}
