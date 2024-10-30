// app/routes/blog.tsx
import { Link } from "@remix-run/react";

import Layout from "~/components/Layout";

export default function Blog() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p>
          Stay tuned for our latest articles on family adventures, travel tips, and more!
        </p>
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </Layout>
  );
}
