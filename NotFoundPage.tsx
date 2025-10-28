
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
        <div className="bg-dark text-white px-2 text-sm rounded rotate-12 absolute -translate-x-1/2 left-1/2 -mt-12">
          Page Not Found
        </div>
        <p className="mt-4 text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <Link 
          to="/"
          className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
