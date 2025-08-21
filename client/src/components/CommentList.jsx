export default function CommentList({ comments = [], onDelete }) {
  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c._id} className="border rounded-md p-3 bg-white dark:bg-gray-900">
          <div className="text-sm">{c.content}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>by {c.author?.username || 'Unknown'}</span>
            {onDelete && (
              <button className="text-xs underline" onClick={() => onDelete(c._id)}>Delete</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

