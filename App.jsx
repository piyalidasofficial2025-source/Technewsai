import React, { useEffect, useState, useRef } from "react";

export default function AiNewsPortal() {
  const [stories, setStories] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticker, setTicker] = useState("");
  const [videos, setVideos] = useState([]);
  const audioRefs = useRef({});

  async function fetchRSSFeed(url, sourceName) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const rssText = await (await fetch(proxyUrl)).json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssText.contents, "text/xml");
      const items = xml.querySelectorAll("item");
      return Array.from(items).slice(0, 10).map((item, i) => ({
        id: `${sourceName}-${i}`,
        title: item.querySelector("title")?.textContent,
        description: item.querySelector("description")?.textContent,
        url: item.querySelector("link")?.textContent,
        publishedAt: item.querySelector("pubDate")?.textContent,
        source: { name: sourceName },
      }));
    } catch (e) {
      console.error(`Failed to fetch ${sourceName}:`, e);
      return [];
    }
  }

  async function fetchVideos() {
    try {
      const youtubeProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://www.youtube.com/feeds/videos.xml?playlist_id=PLS3XGZxi7cBXNn3OZP8QIZK00ZzF6PMkY`
      )}`;
      const data = await (await fetch(youtubeProxy)).json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, "text/xml");
      const entries = xml.querySelectorAll("entry");
      const vids = Array.from(entries).slice(0, 6).map((entry, i) => ({
        id: entry.querySelector("yt\\:videoId")?.textContent || i,
        title: entry.querySelector("title")?.textContent,
        link: entry.querySelector("link")?.getAttribute("href"),
        publishedAt: entry.querySelector("published")?.textContent,
        thumbnail: `https://img.youtube.com/vi/${entry.querySelector("yt\\:videoId")?.textContent}/0.jpg`,
      }));
      setVideos(vids);
    } catch (e) {
      console.error("Video fetch failed", e);
    }
  }

  async function fetchNews() {
    setLoading(true);
    setError(null);
    try {
      const apiKey = "demo"; // Replace with valid key if needed
      let articles = [];

      try {
        const gnewsUrl = `https://gnews.io/api/v4/top-headlines?lang=${lang}&country=in&max=10&apikey=${apiKey}`;
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(gnewsUrl)}`;
        const res = await fetch(proxy);
        const json = await res.json();
        const parsed = JSON.parse(json.contents);
        articles = parsed.articles || [];
      } catch (e1) {
        console.warn("GNews failed, trying RSS feeds.");
      }

      if (!articles.length) {
        const sources = [
          { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News" },
          { url: `https://news.google.com/rss?hl=${lang}`, name: "Google News" },
          { url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", name: "Times of India" },
          { url: "https://www.thehindu.com/feeder/default.rss", name: "The Hindu" },
        ];

        const allFeeds = await Promise.all(sources.map(s => fetchRSSFeed(s.url, s.name)));
        articles = allFeeds.flat();
      }

      if (!articles.length) throw new Error("No news data fetched.");

      const formatted = articles.map((a, i) => ({
        id: a.url || i,
        title: a.title || "Untitled",
        summary: a.description || a.content || "No description available.",
        source: a.source?.name || "Internet",
        publishedAt: a.publishedAt || new Date().toISOString(),
        url: a.url,
        imageUrl: a.image || a.urlToImage || null,
        lang,
      }));

      setStories(formatted);
      setUpdatedAt(new Date().toISOString());
      setTicker(formatted.slice(0, 5).map(s => s.title).join("  •  "));
    } catch (e) {
      console.error("news fetch failed", e);
      setError(`${e.message}. Showing demo data.`);
      const demoStories = [
        {
          id: "demo-1",
          title: "AI News Portal Fallback Active",
          summary: "Could not load live sources. Showing demo news.",
          source: "System",
          publishedAt: new Date().toISOString(),
        },
      ];
      setStories(demoStories);
      setTicker(demoStories.map(s => s.title).join("  •  "));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
    fetchVideos();
    const hourly = setInterval(() => {
      fetchNews();
      fetchVideos();
    }, 60 * 60 * 1000);
    return () => clearInterval(hourly);
  }, [lang]);

  function speak(text) {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (!synth) return alert("TTS not supported in this browser.");
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ta-IN";
    synth.speak(utter);
  }

  function StoryCard({ story }) {
    return (
      <article className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col">
        {story.imageUrl && <img src={story.imageUrl} alt="" className="rounded-lg mb-3" />}
        <header className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug">{story.title}</h3>
          <time className="text-xs text-gray-500">{new Date(story.publishedAt).toLocaleString()}</time>
        </header>
        <p className="text-sm mt-2 flex-1">{story.summary}</p>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={() => speak(story.summary || story.title)} className="px-3 py-1 rounded-full border">🔊 Listen</button>
          {story.url && <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Read More</a>}
        </div>
        <span className="text-xs text-gray-400 mt-2">{story.source}</span>
      </article>
    );
  }

  function VideoCard({ video }) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden">
        <img src={video.thumbnail} alt="thumb" className="w-full" />
        <div className="p-3">
          <h5 className="text-sm font-semibold mb-1">{video.title}</h5>
          <a href={video.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Watch on YouTube</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">AI Audio-Visual News (Live)</h1>
          <p className="text-sm text-gray-500">Live world & Indian updates • English / Tamil / Hindi</p>
        </div>
        <div className="flex gap-2 items-center">
          <select value={lang} onChange={e => setLang(e.target.value)} className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800">
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
          <button onClick={fetchNews} className="ml-2 px-3 py-2 rounded-lg border">{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
      </header>

  {error && <div className="max-w-6xl mx-auto mb-4 text-red-500 text-sm">{error}</div>}

  <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
    <section className="lg:col-span-2 space-y-4">
      <div className="overflow-hidden rounded-2xl">
        <div className="bg-indigo-600 text-white p-3 flex items-center gap-3">
          <strong className="uppercase text-xs">Breaking</strong>
          <div className="truncate" title={ticker}>{ticker || 'No breaking items'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stories.map(s => <StoryCard key={s.id} story={s} />)}
      </div>
    </section>

    <aside className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
        <h4 className="text-sm font-semibold mb-2">Live Video Updates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
        <h4 className="text-sm font-semibold">Updates</h4>
        <p className="text-xs text-gray-500">Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}</p>
      </div>
    </aside>
  </main>

  <footer className="max-w-6xl mx-auto mt-8 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} AI Audio-Visual News — Live Powered.
  </footer>
</div>
;
}
