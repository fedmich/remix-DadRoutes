import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";


export const meta: MetaFunction = () => [
  { title: "Dad Routes - Your Guide to Family Adventures" },
  { name: "description", content: "Discover the best routes and tips for family adventures." },
  { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];


export default function Index() {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <header className="w-full bg-white shadow py-4">
        <h1 className="text-3xl font-bold text-center">Dad Routes</h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <img src="/logo-light.png" alt="Dad Routes Logo" className="mb-8" />
-center flex-grow">
        <img src="/logo-light.png" alt="Dad Routes Logo" className="mb-8" />
        <form onSubmit={handleSubmit} className="mb-4">
        <input
            type="text"
            placeholder="Search for routes..."
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 p-4 rounded-lg w-80 text-center"
          />
          <button type="submit" className="hidden">Search</button>
        </form>

        <Link to="/sign-in">Sign in with Google</Link>
      </main>

      <footer className="bg-white shadow py-4">
        <nav className="flex justify-center space-x-4">
          <a href="/about" className="text-gray-600 hover:text-blue-500">About</a>
          <a href="/contact" className="text-gray-600 hover:text-blue-500">Contact</a>
          <a href="/blog" className="text-gray-600 hover:text-blue-500">Blog</a>
          <a href="/privacy" className="text-gray-600 hover:text-blue-500">Privacy Policy</a>
        </nav>
      </footer>
    </div>
  );
}

