import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article._id}`}
      className="block rounded-lg border overflow-hidden hover:shadow-sm transition bg-white dark:bg-gray-900"
    >
      {article.featuredImageUrl && (
        <img src={article.featuredImageUrl} alt="" className="h-48 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.content }} />
        <div className="text-xs text-gray-500 flex gap-4">
          <span>By {article.author?.username || 'Unknown'}</span>
          <span>👍 {article.likes?.length || 0}</span>
          <span>💬 {article.comments?.length || 0}</span>
          <span>👁️ {article.viewCount || 0}</span>
        </div>
      </div>
    </Link>
  );
}

