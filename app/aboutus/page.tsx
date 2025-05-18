// app/about/page.tsx

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to REDDIT We are dedicated to providing exceptional services to post blogs and daily life experiences.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Our mission is to deliver high-quality images and content that meet the evolving needs of our users. With a team of experienced professionals, we strive for excellence in every project we undertake.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Founded in 2002, we have consistently focused on innovation, customer satisfaction, and integrity. We believe in building lasting relationships with our clients by exceeding their expectations.
      </p>
      <p className="text-lg text-gray-700">
        Thank you for choosing REDDIT. We look forward to working with you!
      </p>
    </main>
  );
};

export default AboutPage;
