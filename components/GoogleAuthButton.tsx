'use client';

import { useState } from 'react'; // Tambahkan ini
import { createClient } from '@/utils/supabase/client';

export default function GoogleAuthButton({ text = "Start Now", className = "" }) {
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const supabase = createClient();

  const handleLogin = async () => {
    setIsLoading(true); // Set loading jadi true saat diklik
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
},
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false); // Matikan loading jika ada error agar user bisa coba lagi
    }
    // Note: Jika berhasil, halaman akan redirect otomatis oleh Supabase, 
    // jadi kita tidak perlu set isLoading(false) di sini.
  };

  return (
    <button 
      onClick={handleLogin}
      disabled={isLoading} // Cegah klik ganda (spam)
      className={`${className} flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          {/* Simple Tailwind Spinner */}
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
}