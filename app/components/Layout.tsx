// app/components/Layout.tsx
import { Link } from "@remix-run/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="w-full bg-white shadow py-4">
        <h1 className="text-3xl font-bold text-center">
          <Link to="/">Dad Routes</Link>
        </h1>
      </header>

      <main className="flex-grow p-4">
        {children}
      </main>

      <footer className="bg-white shadow py-4">
        <nav className="flex justify-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
          <Link to="/users" className="text-gray-600 hover:text-blue-500">Community</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
          {/* <Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link> */}
          <Link to="/blog" className="text-gray-600 hover:text-blue-500">Blog</Link>
          <Link to="/privacy" className="text-gray-600 hover:text-blue-500">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
