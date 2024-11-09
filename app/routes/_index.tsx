import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import Testimonials from '~/components/Testimonials'; // Import the Testimonials component
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

    <div className="flex flex-col min-h-screen items-center bg-gray-100">
      <header className="w-full bg-white shadow py-6">
        <h1 className="text-3xl font-bold text-center">Dad Routes</h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow pt-12 px-4">
        <div className="mt-12 mb-12">
          <img src="/logo-light.png" alt="Dad Routes Logo" className="mb-8 mx-auto" />
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


        </div>
        {/* Copy text and features with animation */}
        <div className="container max-w-5xl mx-auto">
          <motion.section
            className="px-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold max-w-3xl mx-auto text-left">Discover Amazing Routes</h2>

            <div className="main_bullet max-w-3xl mx-auto text-left">

              <ul className="list-disc list-inside text-gray-700 mb-12 px-8">
                <li>Find routes tailored for family outings, with highlights on scenic paths and safe trails.</li>
                <li>Get insights from community reviews, so you know what to expect before each ride.</li>
                <li>Navigate confidently with our in-depth maps and route previews that guide you every step.</li>
                <li>Stay connected with a biking community that values fun, safety, and exploration.</li>
              </ul>
            </div>
            <p className="max-w-3xl mx-auto text-center">
              Join our community of biking enthusiasts and start your adventure today!
            </p>

          </motion.section>

          {/* InfoSections */}
          <InfoSection
            imageSrc="/images/route1.jpg"
            altText="Scenic Route 1"
            title="Breathtaking Scenic Routes"
            content="Our platform offers a range of carefully selected routes that take you through stunning landscapes and peaceful natural settings. Ideal for families looking to enjoy the beauty of nature while cycling together, these routes are scenic yet accessible to all ages. Explore trails with ample rest stops, allowing you to relax and appreciate the surroundings with your loved ones."
          />
          <InfoSection
            imageSrc="/images/route2.jpg"
            altText="Safe Paths"
            title="Safety First on Every Route"
            content="Safety is at the heart of every route recommendation we provide.	 With child-friendly paths, low-traffic routes, and clearly marked trails, you can rest assured that your family's adventure will be both exciting and secure. We take into account route conditions, elevation, and other factors to make sure that every adventure is safe and enjoyable."
            reverse
          />
          <InfoSection
            imageSrc="/images/route3.jpg"
            altText="Community Feedback"
            title="Trusted Community Feedback"
            content="Gain insights and tips from our active biking community! Each route includes reviews and comments from users who have experienced the trail themselves, sharing valuable information and useful pointers. Join our community to share your own adventures and help other families find the perfect routes for their journeys."
          />
          <InfoSection
            imageSrc="/images/route4.jpg"
            altText="Detailed Navigation"
            title="Seamless Navigation Assistance"
            content="Never get lost with our detailed maps and GPS-enabled navigation guides. Our platform provides route previews, elevation charts, and turn-by-turn navigation to ensure that every biking adventure is smooth from start to finish. Enjoy peace of mind knowing that every turn has been mapped out, making your ride as enjoyable as possible."
            reverse
          />
        <InfoSection
          imageSrc="/images/route5.jpg"
          altText="Join Our Community"
          title="Join Our Community"
            content="Discover, share, and connect with other biking enthusiasts who love family outings just as much as you do! As part of our community, you'll gain access to exclusive events, group rides, and a wealth of shared knowledge. Whether you're a beginner or a seasoned cyclist, there's a place for you here."
          />
        </div>

        <Testimonials />

        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto max-w-7x1">
            <div className="flex flex-wrap w-full mb-4 p-4">
              <div className="w-full mb-6 lg:mb-0">
                <h1 className="sm:text-4xl text-5xl font-medium font-bold title-font mb-2 text-gray-900">Featured</h1>
                <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              </div>
            </div>
            <div className="flex flex-wrap -m-4">
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="bg-white p-6 rounded-lg">
                  <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6" src="https://kuyou.id/content/images/ctc_2020021605150668915.jpg" alt="Image Size 720x400" />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Chichen Itza</h2>
                  <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                </div>
              </div>
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="bg-white p-6 rounded-lg">
                  <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://asset.kompas.com/crops/Pk_pN6vllxXy1RshYsEv74Q1BYA=/56x0:1553x998/750x500/data/photo/2021/06/16/60c8f9d68ff4a.jpg" alt="Image Size 720x400" />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Colosseum Roma</h2>
                  <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                </div>
              </div>
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="bg-white p-6 rounded-lg">
                  <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://images.immediate.co.uk/production/volatile/sites/7/2019/07/33-GettyImages-154260931-216706f.jpg?quality=90&resize=768%2C574" alt="Image Size 720x400" />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Great Pyramid of Giza</h2>
                  <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                </div>
              </div>
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="bg-white p-6 rounded-lg">
                  <img className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6" src="https://wisatamuda.com/wp-content/uploads/2019/02/1-Golden-Gate-Bridge-Gambar-dan-Foto-Tempat-Wisata-Terbaik-di-San-Fransisco-USA.jpg" alt="Image Size 720x400" />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">San Francisco</h2>
                  <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Link to="/register" className="text-blue-500 underline mt-8">Sign in with Google</Link>
      </main>

      <footer className="bg-white shadow py-6 mt-16 w-full">
        <nav className="flex justify-center space-x-8">
          <Link to="/users" className="text-gray-600 hover:text-blue-500">Community</Link>
          <a href="/about" className="text-gray-600 hover:text-blue-500">About</a>
          <a href="/contact" className="text-gray-600 hover:text-blue-500">Contact</a>
          <a href="/blog" className="text-gray-600 hover:text-blue-500">Blog</a>
          <a href="/privacy" className="text-gray-600 hover:text-blue-500">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}

