import { useEffect, useMemo, useState } from 'react';
import { articlesApi } from '../api/articles';
import Navbar from '../components/Navbar.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    articlesApi.list({ page, limit: 9, q: query }).then((data) => {
      setArticles(data.items);
      setPages(data.pages);
    });
  }, [page, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => a.title.toLowerCase().includes(q));
  }, [articles, query]);

  return (
    <div>
      <Navbar onSearch={setQuery} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="sm:hidden mb-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <button className="px-3 py-1.5 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <span className="text-sm px-2 py-1.5">Page {page} / {pages}</span>
          <button className="px-3 py-1.5 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
        </div>
      </main>
    </div>
  );
}

