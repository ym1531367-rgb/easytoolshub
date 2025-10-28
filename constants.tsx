import React from 'react';
// FIX: Import 'Tool' type from './types' to fix the 'Cannot find name 'Tool'' error.
import { ToolCategory, NavLink, Tool } from './types';
import WordCounter from './tools/WordCounter';
import TextToImage from './tools/TextToImage';
import AiChatbot from './tools/AiChatbot';
import MergePdf from './tools/MergePdf';
import SplitPdf from './tools/SplitPdf';
import PdfToText from './tools/PdfToText';
import CompressPdf from './tools/CompressPdf';
import TextReverser from './tools/TextReverser';
import RemoveExtraSpaces from './tools/RemoveExtraSpaces';
import CaseConverter from './tools/CaseConverter';
import CompressImage from './tools/CompressImage';
import ResizeImage from './tools/ResizeImage';
import BackgroundRemover from './tools/BackgroundRemover';
import ConvertImage from './tools/ConvertImage';
import VoiceGenerator from './tools/VoiceGenerator';
import MemeGenerator from './tools/MemeGenerator';
import RandomNamePicker from './tools/RandomNamePicker';
import PasswordGenerator from './tools/PasswordGenerator';


// Icons
const PDFIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm5 4a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5zM10 15.5a1.5 1.5 0 013 0V16a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V21a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5zM8.5 10a1.5 1.5 0 010-3H8a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H3a1 1 0 001 1v.5a1.5 1.5 0 013 0V8a1 1 0 001-1h.5zm3 0a1.5 1.5 0 010-3H12a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H7a1 1 0 001 1v.5a1.5 1.5 0 013 0V8a1 1 0 001-1h.5z" /></svg>;
const FunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.5.5 0 01.708 0 4 4 0 01-5.656 0 .5.5 0 01.708-.707 3 3 0 004.24 0 .5.5 0 01.708.707z" clipRule="evenodd" /></svg>;

const NotImplemented = () => <div className="text-center p-8 bg-yellow-100 border border-yellow-300 rounded-lg"><h3 className="text-xl font-bold text-yellow-800">Tool Not Implemented Yet</h3><p className="text-yellow-700 mt-2">This feature is coming soon. Stay tuned!</p></div>;


export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/#pdf-tools' },
  { name: 'Image Tools', path: '/#image-tools' },
  { name: 'Text Tools', path: '/#text-tools' },
  { name: 'AI Tools', path: '/#ai-tools' },
  { name: 'Contact', path: '/contact' },
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, Split, Compress, & Convert your PDF files with ease.',
    icon: <PDFIcon />,
    tools: [
      { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one.', component: <MergePdf /> },
      { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from a PDF.', component: <SplitPdf /> },
      { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce the file size of your PDF.', component: <CompressPdf /> },
      { id: 'pdf-to-word', name: 'PDF Content Extractor', description: 'Extract text from PDF files using AI.', component: <PdfToText /> },
    ],
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    description: 'Count words, reverse text, and perform other text manipulations.',
    icon: <TextIcon />,
    tools: [
      { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, and sentences.', component: <WordCounter /> },
      { id: 'text-reverser', name: 'Text Reverser', description: 'Reverse any text string instantly.', component: <TextReverser /> },
      { id: 'remove-extra-spaces', name: 'Remove Extra Spaces', description: 'Clean up text by removing extra spaces.', component: <RemoveExtraSpaces /> },
      { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, etc.', component: <CaseConverter /> },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    description: 'Compress, resize, and convert your images in seconds.',
    icon: <ImageIcon />,
    tools: [
      { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size without losing quality.', component: <CompressImage /> },
      { id: 'resize-image', name: 'Resize Image', description: 'Change the dimensions of your images.', component: <ResizeImage /> },
      { id: 'background-remover', name: 'Background Remover', description: 'Automatically remove the background from an image.', component: <BackgroundRemover /> },
      { id: 'convert-image', name: 'Convert Image Format', description: 'Convert images to JPG, PNG, WEBP, etc.', component: <ConvertImage /> },
    ],
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    description: 'Leverage the power of AI for text, images, and voice generation.',
    icon: <AIIcon />,
    tools: [
      { id: 'text-to-image', name: 'Text-to-Image Generator', description: 'Create stunning images from text descriptions.', component: <TextToImage /> },
      { id: 'ai-chatbot', name: 'AI Chatbot', description: 'Have a conversation with an advanced AI.', component: <AiChatbot /> },
      { id: 'voice-generator', name: 'AI Voice Generator', description: 'Generate realistic speech from text.', component: <VoiceGenerator /> },
    ],
  },
  {
    id: 'fun-tools',
    name: 'Fun Tools',
    description: 'Explore a collection of fun and useful miscellaneous tools.',
    icon: <FunIcon />,
    tools: [
      { id: 'meme-generator', name: 'Meme Generator', description: 'Create your own custom memes.', component: <MemeGenerator /> },
      { id: 'random-name-picker', name: 'Random Name Picker', description: 'Pick a random name from a list.', component: <RandomNamePicker /> },
      { id: 'password-generator', name: 'Strong Password Generator', description: 'Create secure, random passwords.', component: <PasswordGenerator /> },
    ],
  },
];

export const ALL_TOOLS: Tool[] = TOOL_CATEGORIES.flatMap(category => category.tools);