// app/routes/about.tsx
import Layout from "~/components/Layout";


export const meta: MetaFunction = () => [
  { title: "About - Dad Routes" },
  { name: "description", content: "Discover the best routes and tips for family adventures." },
  { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];

export default function About() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p>
        Welcome to Dad Routes! We provide the best routes and tips for family adventures. Our goal is to help dads and families create unforgettable memories together.
      </p>
    </Layout>
  );
}
