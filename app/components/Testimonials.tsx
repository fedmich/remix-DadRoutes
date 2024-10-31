// app/components/Testimonials.tsx

import React from 'react';

const testimonials = [
  { name: "Alice", text: "Dad Routes helped us find amazing biking trails for our family!" },
  { name: "Bob", text: "Fantastic platform! We discovered new routes every weekend." },
  { name: "Charlie", text: "The tips and community support are invaluable for our adventures!" },
];

const Testimonials = () => {
  return (
    <section className="px-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic">
            <p>"{testimonial.text}"</p>
            <cite className="block mt-2">- {testimonial.name}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
