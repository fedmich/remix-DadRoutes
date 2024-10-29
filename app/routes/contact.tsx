// app/routes/contact.tsx
import { Link } from "@remix-run/react";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p>
        If you have any questions or feedback, feel free to reach out to us at contact@dadroutes.com.
      </p>
      <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
    </div>
  );
}
