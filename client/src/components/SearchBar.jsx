export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Search articles..."
      className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
    />
  );
}

