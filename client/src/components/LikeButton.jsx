export default function LikeButton({ liked, count, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-md text-sm border ${liked ? 'bg-pink-600 text-white' : 'bg-white dark:bg-gray-800'}`}
    >
      👍 {count}
    </button>
  );
}

