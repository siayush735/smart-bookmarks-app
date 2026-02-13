"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// Bookmark type
interface Bookmark {
  id: number;
  title: string;
  url: string;
  user_id: string;
}

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      loadBookmarks(data.user.id);
    };

    loadUser();
  }, [router]);

  // Load bookmarks
  const loadBookmarks = async (userId: string): Promise<void> => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (!error && data) {
      setBookmarks(data as Bookmark[]);
    }
  };

  // Add bookmark
  const addBookmark = async (): Promise<void> => {
    if (!title.trim() || !url.trim()) {
      alert("Please enter title and URL");
      return;
    }

    if (!user) return;

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) {
      alert("Error adding bookmark");
      return;
    }

    setTitle("");
    setUrl("");
    loadBookmarks(user.id);
  };

  // Delete bookmark
  const deleteBookmark = async (id: number): Promise<void> => {
    await supabase.from("bookmarks").delete().eq("id", id);

    if (user) loadBookmarks(user.id);
  };

  // Logout
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Smart Bookmark App</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Input Area */}
        <div className="flex gap-6 mb-6 ">
          <input
            type="text"
            placeholder="Bookmark title"
            className="px-3 py-2 rounded text-amber-50 border border-b-neutral-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="https://example.com"
            className="px-3 py-2 rounded text-amber-50 border border-b-neutral-600"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addBookmark}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <p className="text-gray-400">No bookmarks yet...</p>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-gray-900 rounded border border-gray-600 flex justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">{b.title}</h2>
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    {b.url}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
