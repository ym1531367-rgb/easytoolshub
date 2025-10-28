
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOL_CATEGORIES } from '../constants';
import SearchBar from '../components/SearchBar';
import AdSlot from '../components/AdSlot';

const HomePage: React.FC = () => {

  useEffect(() => {
    document.title = 'EasyToolsHub - Free Online Tools for PDF, Images, Text & AI';
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark tracking-tight leading-tight">
            All Your Free Online Tools in One Place
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, Easy & Reliable Tools for PDFs, Text, Images, AI, and More
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <div className="mt-6">
            <a href="#tools" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
              Start Using Tools
            </a>
          </div>
        </div>
      </section>

      {/* Tool Categories Grid */}
      <section id="tools" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.id} id={category.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-2xl font-bold ml-4">{category.name}</h3>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-3">
                  {category.tools.slice(0, 4).map(tool => (
                    <li key={tool.id}>
                      <Link to={`/tool/${tool.id}`} className="text-gray-700 hover:text-primary transition-colors duration-200 group flex items-center">
                        <span className="text-primary mr-2 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Monetization Section */}
       <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Premium Tools & Offers</h2>
            <AdSlot height="h-64" />
        </div>
       </section>

    </div>
  );
};

export default HomePage;
