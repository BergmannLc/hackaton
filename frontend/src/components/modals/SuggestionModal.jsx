import React, { useState } from 'react';
import { Lightbulb, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const SuggestionModal = ({ onClose, onSubmitIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIdea({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-slate-900 rounded-3xl p-6 w-full max-w-md relative z-10 border border-slate-800"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Lightbulb className="text-amber-400" /> Sugerir Evento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Título da Ideia</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" placeholder="Ex: Workshop de Inteligência Artificial" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Por que seria legal?</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="4" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none" placeholder="Explique um pouco mais sobre a sua ideia..." />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"><Send size={18} /> Enviar Ideia</button>
        </form>
      </motion.div>
    </div>
  );
};
