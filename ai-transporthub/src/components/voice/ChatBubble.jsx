/**
 * ChatBubble — single message in the voice conversation transcript
 */
import { Mic, Sparkles } from "lucide-react";

export default function ChatBubble({ role, text, lang }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
          <Sparkles size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isUser
          ? "bg-primary-600 text-white rounded-tr-sm"
          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm"
      }`}>
        {text}
        {lang && !isUser && (
          <p className="text-[10px] mt-1 text-slate-400">{lang}</p>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Mic size={14} className="text-slate-600 dark:text-slate-400" />
        </div>
      )}
    </div>
  );
}
