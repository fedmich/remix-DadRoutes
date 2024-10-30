// app/components/InfoSection.tsx

import React from 'react';

interface InfoSectionProps {
  imageSrc: string;
  altText: string;
  title: string;
  content: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ imageSrc, altText, title, content }) => {
  return (
    <section className="flex flex-col md:flex-row items-center mb-8 p-4 bg-gray-100 rounded-lg shadow">
      <div className="md:w-1/2 mb-4 md:mb-0">
        <img src={imageSrc} alt={altText} className="w-full h-auto rounded-lg" />
      </div>
      <div className="md:w-1/2 md:pl-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700">{content}</p>
      </div>
    </section>
  );
};

export default InfoSection;
