import React, { useEffect, useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('en');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState('—');

  const endpoints = {
    en: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://feeds.bbci.co.uk/news/rss.xml'),
    hi: 'https://newsdata.io/api/1/news?apikey=pub_fefd285deecd4e7cbb8dd38b5923adb1&language=hi',
    ta: 'https://newsdata.io/api/1/news?apikey=pub_fefd285deecd4e7cbb8dd38b5923adb1&language=ta'
  };

  const liveEmbeds = {
    en: 'https://www.bbc.com/news/av/embed/p08t2g54/53999932',
    hi: 'https://www.tv9hindi.com/live-tv',
    ta: 'https://www.24x7liveindia.com/embed/puthiyathalaimurai'
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [lang]);

  async function fetchNews() {
    setLoading(true); setError(''); setArticles([]);
    try {
      const res = await fetch(endpoints[lang]);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const list = (data.results || data.items || []).slice(0, 10).map(a => ({
        title: a.title || a.heading || 'Untitled',
        description: a.description || a.content || '',
        link: a.link || a.url || ''
      }));
      if (!list.length) throw new Error('No articles found');
      setArticles(list);
      setUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setError('Failed to load news: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'hi' ? 'hi-IN' : (lang === 'ta' ? 'ta-IN' : 'en-US');
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utter.lang)) || voices.find(v => v.lang.includes('en')) || voices[0];
    if (voice) utter.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  return (
    <div>
      <header>
        <h1>AI Audio-Visual Global News Portal</h1>
        <div className="controls">
          <button className={`lang ${lang==='en'?'active':''}`} onClick={() => setLang('en')}>English</button>
          <button className={`lang ${lang==='hi'?'active':''}`} onClick={() => setLang('hi')}>हिन्दी</button>
          <button className={`lang ${lang==='ta'?'active':''}`} onClick={() => setLang('ta')}>தமிழ்</button>
          <button className="refresh" onClick={fetchNews}>🔄 Refresh</button>
        </div>
      </header>
      {error && <div className="error">{error}</div>}
      <div className="container">
        <main>
          {loading ? <div className="loader">Loading news…</div> : (
            articles.map((a,i) => (
              <article key={i}>
                <h3>{a.title}</h3>
                <p dangerouslySetInnerHTML={{__html:a.description}}></p>
                <div style={{display:'flex',gap:8}}>
                  <button style={{background:'#2563eb',color:'#fff'}} onClick={() => speak(a.title + '. ' + a.description)}>🔊 Listen Full</button>
                  {a.link && <a className="read" href={a.link} target="_blank" rel="noreferrer">Read more</a>}
                </div>
              </article>
            ))
          )}
        </main>
        <aside>
          <h4>Live Video</h4>
          <iframe title="live" src={liveEmbeds[lang]} allowFullScreen></iframe>
          <div style={{marginTop:12,color:'#6b7280',textAlign:'center'}}>Last updated: {updated}</div>
        </aside>
      </div>
    </div>
  );
}