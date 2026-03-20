'use client';

import { useState } from 'react';
import { X } from 'lucide-react'; // Pastikan sudah install lucide-react

export default function SuccessAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs font-black flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-500">
      <span>✓ PERSONAL INFORMATION UPDATED!</span>
      <button 
        onClick={() => setIsVisible(false)}
        className="hover:bg-green-200 p-1 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}