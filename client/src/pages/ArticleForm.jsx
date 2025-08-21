import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import { http } from '../api/http';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ArticleForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user]);

  useEffect(() => {
    if (editing) {
      articlesApi.get(id).then(({ article }) => {
        setTitle(article.title);
        setContent(article.content);
        setFeaturedImageUrl(article.featuredImageUrl || '');
      });
    }
  }, [id]);

  const onUpload = async (file) => {
    const form = new FormData();
    form.append('image', file);
    const { data } = await http.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setFeaturedImageUrl(data.url);
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">{editing ? 'Edit' : 'Create'} Article</h1>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Title" />
        <ReactQuill theme="snow" value={content} onChange={setContent} />
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
          <button className="px-3 py-2 rounded-md border text-sm" onClick={() => fileRef.current?.click()}>Upload Image</button>
          {featuredImageUrl && <img src={featuredImageUrl} alt="" className="h-12 rounded" />}
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-md border"
            onClick={async () => {
              const payload = { title, content, featuredImageUrl };
              if (editing) await articlesApi.update(id, payload);
              else await articlesApi.create(payload);
              navigate('/admin');
            }}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}

