import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto px-8">
        <div className="w-full flex flex-col md:flex-row py-4">
          <div className="flex-1 mb-6">
            <a
              aria-label="Uniform"
              className="text-orange-600 no-underline hover:no-underline"
              href="https://uniform.dev"
            >
              <Logo />
            </a>
          </div>
          <p className="text-gray-900 text-right flex-1 leading-8">
            Uniform Context starter for Next.js © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;