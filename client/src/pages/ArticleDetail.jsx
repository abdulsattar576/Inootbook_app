import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import { commentsApi } from '../api/comments';
import Navbar from '../components/Navbar.jsx';
import LikeButton from '../components/LikeButton.jsx';
import CommentList from '../components/CommentList.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [analytics, setAnalytics] = useState({ likes: 0, comments: 0, views: 0 });
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const refresh = async () => {
    const { article: a, analytics: an } = await articlesApi.get(id);
    setArticle(a);
    setAnalytics(an);
  };

  useEffect(() => {
    refresh();
  }, [id]);

  if (!article) return null;

  const isLiked = !!article.likes?.find((u) => u === user?.id);

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        {article.featuredImageUrl && (
          <img src={article.featuredImageUrl} alt="" className="rounded-md mb-4" />
        )}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
          <span>👁️ {article.viewCount}</span>
          <LikeButton liked={isLiked} count={article.likes?.length || 0} onToggle={async () => {
            await articlesApi.like(article._id);
            await refresh();
          }} />
        </div>

        <section className="mt-8">
          <h2 className="font-semibold mb-3">Comments</h2>
          {user && (
            <form className="mb-4 flex gap-2" onSubmit={async (e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              await articlesApi.comment(article._id, newComment.trim());
              setNewComment('');
              await refresh();
            }}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                placeholder="Add a comment"
              />
              <button className="px-3 py-2 rounded-md border text-sm">Post</button>
            </form>
          )}
          <CommentList
            comments={article.comments || []}
            onDelete={user ? async (cid) => { await commentsApi.remove(cid); await refresh(); } : undefined}
          />
        </section>
      </main>
    </div>
  );
}

