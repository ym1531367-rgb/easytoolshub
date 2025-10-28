
import React from 'react';

interface SocialShareProps {
  toolName: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ toolName }) => {
  const url = window.location.href;
  const text = `Check out this awesome tool: ${toolName} on EasyToolsHub!`;

  const platforms = [
    { name: 'Twitter', link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { name: 'Facebook', link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', link: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(toolName)}&summary=${encodeURIComponent(text)}` },
    { name: 'WhatsApp', link: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}` },
  ];

  return (
    <div className="mt-8 p-4 bg-slate-100 rounded-lg">
      <h3 className="text-lg font-semibold text-center mb-4">Share this tool</h3>
      <div className="flex justify-center items-center space-x-4">
        {platforms.map(p => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-primary transition-all duration-200 shadow-sm"
          >
            {p.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
