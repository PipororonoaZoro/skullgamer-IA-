import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Loader2, HardDrive, MonitorPlay, LogOut } from 'lucide-react';
import { Message } from '../types';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { logOut } from '../firebase';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "¡Hola! Soy **SkullGamer AI**, tu asistente experto en hardware para armar la PC de tus sueños. ¿Cuál es tu presupuesto o qué tipo de uso le darás a tu nueva computadora (gaming competitivo, streaming, diseño, etc.)?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyMsg = messages.map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', content: msg.content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: historyMsg.slice(1),
          message: userMsg.content
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
      }
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Hubo un error al generar la respuesta."
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
       setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Error de conexión. Asegúrate de configurar correctamente las claves API."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-stone-950 text-stone-100 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-900/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-stone-800/40 blur-3xl rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex-none p-4 border-b border-stone-800 bg-stone-900/50 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              SkullGamer <span className="text-red-500 font-black">AI</span>
            </h1>
            <p className="text-xs text-stone-400 font-mono">ASISTENTE DE HARDWARE</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-4 text-stone-500 items-center">
          <MonitorPlay className="w-5 h-5" />
          <HardDrive className="w-5 h-5" />
          <button onClick={logOut} className="ml-4 hover:text-red-400 transition-colors" title="Cerrar sesión">
             <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth z-10"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                  message.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-none shadow-lg'
                    : 'bg-stone-800 border border-stone-700 text-stone-200 rounded-bl-none shadow-md'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider">SKULLGAMER AI</span>
                  </div>
                )}
                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-800 prose-red max-w-none text-sm sm:text-base">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-stone-800 border border-stone-700 text-stone-200 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                <span className="text-sm font-mono text-stone-400">Analizando componentes...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-stone-900/80 border-t border-stone-800 backdrop-blur-md z-10">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu presupuesto o requisitos aquí..."
            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none overflow-hidden min-h-[52px] max-h-32"
            rows={1}
            style={{
              height: "auto",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-red-600 hover:bg-red-500 disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center h-[52px] w-[52px]"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
        <p className="text-center text-[10px] text-stone-600 mt-3 font-mono">
          SkullGamer AI puede cometer errores. Verifica la compatibilidad de los componentes.
        </p>
      </div>
    </div>
  );
}
