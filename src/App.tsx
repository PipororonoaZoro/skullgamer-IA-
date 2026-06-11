/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { auth, signInWithGoogle, onAuthStateChanged, User } from "./firebase";
import { ShieldCheck, LogIn, Cpu } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-stone-950 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-stone-950 to-stone-950 pointer-events-none"></div>
        <Cpu className="w-12 h-12 text-red-600 animate-pulse relative z-10" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-stone-950 min-h-screen flex items-center justify-center font-sans p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-stone-950 to-stone-950 pointer-events-none"></div>
        
        <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 p-8 rounded-2xl max-w-sm w-full text-center relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso a Hardware AI</h1>
          <p className="text-stone-400 mb-8 text-sm">
            Inicia sesión para recibir asesoramiento personalizado en ensamblado de PC.
          </p>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-stone-200 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Ingresar con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 min-h-screen flex items-center justify-center font-sans p-0 sm:p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-stone-950 to-stone-950 pointer-events-none"></div>
      
      <div className="w-full max-w-4xl h-[100dvh] sm:h-[85vh] rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border border-stone-800 shadow-2xl relative z-10 flex flex-col bg-stone-950">
        <Chat />
      </div>
    </div>
  );
}
