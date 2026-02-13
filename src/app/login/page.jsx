'use client';

import { supabase } from "@/lib/supabaseClient";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) console.error("Google login error:", error.message);
  };

  return (
    <div className="flex justify-center items-center bg-neutral-900 h-screen">
      <button 
        onClick={signIn}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-lg flex items-center gap-3 shadow-lg"
      >
        <FaGoogle className="text-white text-2xl" />
        Sign in with Google
      </button>
    </div>
  );
}
