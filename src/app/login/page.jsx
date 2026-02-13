'use client';

import { supabase } from "@/lib/supabaseClient";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });

    if (error) console.error(error);
  };

  return (
    <div className="flex justify-center items-center bg-neutral-500 h-screen">
      <button 
        onClick={signIn}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded flex items-center gap-2 "
      >
        Sign in with Google <FaGoogle className="text-red-600" />
      </button>
    </div>
  );
}
