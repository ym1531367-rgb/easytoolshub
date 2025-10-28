
import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_TOOLS } from '../constants';
import NotFoundPage from './NotFoundPage';
import AdSlot from '../components/AdSlot';
import SocialShare from '../components/SocialShare';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  
  const tool = useMemo(() => ALL_TOOLS.find(t => t.id === toolId), [toolId]);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} - EasyToolsHub`;
      window.scrollTo(0, 0);
    }
  }, [tool]);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-dark">{tool.name}</h1>
          <p className="mt-3 text-lg text-gray-600">{tool.description}</p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl">
          {tool.component}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">How to Use</h3>
                <p className="text-gray-700">
                    Instructions for using the {tool.name} tool will appear here. This section provides users with clear, step-by-step guidance to ensure they can use the tool effectively and get the best results.
                </p>
            </div>
            <div className="md:col-span-1">
                 <AdSlot height="h-full" />
            </div>
        </div>
        
        <SocialShare toolName={tool.name} />
        
        <div className="mt-12 text-center">
            <Link to="/" className="text-primary hover:underline">&larr; Back to all tools</Link>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
