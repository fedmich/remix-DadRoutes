import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion

import InfoSection from '~/components/InfoSection'; // Import the InfoSection component

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

        {/* Copy text and features with animation */}
        <motion.section
          className="px-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Discover Amazing Routes</h2>
          <p>Explore our vast collection of family-friendly biking routes that offer:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Scenic views and beautiful landscapes</li>
            <li>Safe paths for kids and families</li>
            <li>Tips from experienced bikers</li>
            <li>Community feedback on routes</li>
            <li>Route ratings from fellow adventurers</li>
            <li>Detailed maps and navigation assistance</li>
            <li>Regularly updated route information</li>
          </ul>
          <p>Join our community of biking enthusiasts and start your adventure today!</p>
        </motion.section>

        {/* Info Sections */}
        <InfoSection
          imageSrc="/images/route1.jpg"
          altText="Scenic Route 1"
          title="Explore Scenic Routes"
          content="Discover breathtaking scenic routes designed for family adventures, perfect for creating unforgettable memories."
        />
        <InfoSection
          imageSrc="/images/route2.jpg"
          altText="Safe Paths"
          title="Safety First"
          content="Our routes prioritize safety, providing paths that are perfect for kids and families to enjoy biking together."
        />
        <InfoSection
          imageSrc="/images/route3.jpg"
          altText="Community Feedback"
          title="Community Insights"
          content="Benefit from community feedback and tips from experienced bikers who have traveled these routes."
        />
        <InfoSection
          imageSrc="/images/route4.jpg"
          altText="Detailed Navigation"
          title="Detailed Navigation"
          content="Get access to detailed maps and navigation assistance to make your biking experience smooth and enjoyable."
        />
        <InfoSection
          imageSrc="/images/route5.jpg"
          altText="Join Our Community"
          title="Join Our Community"
          content="Become part of a vibrant community of biking enthusiasts sharing experiences, tips, and routes!"
        />

        {/* Commented out the Testimonials section */}
        {/* <Testimonials /> */}

        {/* Uncomment the following line when ready to use the sign-in feature */}
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

