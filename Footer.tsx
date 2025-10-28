
import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Twitter', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> },
    { name: 'Facebook', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
    { name: 'GitHub', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> },
  ];

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h3 className="text-xl font-bold text-primary mb-2">EasyToolsHub</h3>
                <p className="text-gray-600">All your free online tools in one place. Fast, easy, and reliable.</p>
                <div className="flex space-x-4 mt-4">
                    {socialLinks.map(link => (
                        <a key={link.name} href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
            <div className="md:col-span-1">
                <h4 className="font-semibold text-gray-700 mb-3">Quick Links</h4>
                <ul className="space-y-2">
                    <li><Link to="/#about" className="text-gray-600 hover:text-primary">About Us</Link></li>
                    <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
                    <li><Link to="/#privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
                </ul>
            </div>
            <div className="md:col-span-1">
                <h4 className="font-semibold text-gray-700 mb-3">Monetization</h4>
                 <AdSlot width="w-full" height="h-24" />
            </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} EasyToolsHub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
