'use client';

import { createClient } from '@/utils/supabase/client';

export default function GoogleAuthButton({ text = "Start Now", className = "" }) {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button 
      onClick={handleLogin}
      className={className}
    >
      {text}
    </button>
  );
}