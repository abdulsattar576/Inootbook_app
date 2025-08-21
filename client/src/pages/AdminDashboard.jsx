import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usersApi } from '../api/users';
import { articlesApi } from '../api/articles';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { articlesApi } from '../api/articles';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ likes: 0, comments: 0, views: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user]);

  useEffect(() => {
    usersApi.list().then(setUsers);
    articlesApi.analytics().then(setSummary);
    articlesApi.list({ limit: 20, sort: '-createdAt' }).then((d) => setArticles(d.items));
  }, []);

  const chartData = articles.map((a, idx) => ({
    name: `#${articles.length - idx}`,
    likes: a.likes?.length || 0,
    comments: a.comments?.length || 0,
    views: a.viewCount || 0,
  })).reverse();

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <section className="grid md:grid-cols-4 gap-4">
          <SummaryCard title="Users" value={users.length} />
          <SummaryCard title="Likes" value={summary.likes} />
          <SummaryCard title="Comments" value={summary.comments} />
          <SummaryCard title="Views" value={summary.views} />
        </section>

        <section className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 border rounded-lg p-4 bg-white dark:bg-gray-900">
            <h2 className="font-semibold mb-3">Article Metrics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="likes" stroke="#ec4899" fillOpacity={1} fill="url(#colorLikes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
            <h2 className="font-semibold mb-3">Latest Articles</h2>
            <ul className="space-y-3">
              {articles.slice(0, 10).map((a) => (
                <li key={a._id} className="flex items-center justify-between gap-3 text-sm">
                  <Link className="truncate" to={`/articles/${a._id}`}>{a.title}</Link>
                  <div className="flex items-center gap-2">
                    <Link className="text-xs underline" to={`/admin/articles/${a._id}`}>Edit</Link>
                    <button
                      className="text-xs underline text-red-600"
                      onClick={async () => {
                        await articlesApi.remove(a._id);
                        toast.success('Article deleted');
                        const d = await articlesApi.list({ limit: 20, sort: '-createdAt' });
                        setArticles(d.items);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

