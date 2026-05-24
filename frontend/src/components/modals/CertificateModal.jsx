import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CertificateModal = ({ onClose }) => {
  const [status, setStatus] = useState('idle');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onClose, 2000);
    }, 1500);
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><UploadCloud className="text-emerald-400" /> Enviar Certificado</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        
        {status === 'success' ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4"><CheckCircle size={40} /></div>
            <h3 className="text-xl font-bold text-white mb-2">Enviado com Sucesso!</h3>
            <p className="text-slate-400">Seu certificado foi enviado para análise da coordenação.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nome do Curso / Evento</label>
              <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" placeholder="Ex: Curso de Python Completo" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Carga Horária (h)</label>
              <input required type="number" min="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" placeholder="Ex: 40" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Arquivo (PDF ou Imagem)</label>
              <label className="w-full bg-slate-950 border border-slate-800 border-dashed hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-indigo-400 group">
                <UploadCloud size={32} className="mb-2 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                <span className="text-sm font-medium">Clique para anexar arquivo</span>
                <input required type="file" className="hidden" accept=".pdf,image/*" />
              </label>
            </div>
            <button type="submit" disabled={status === 'sending'} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {status === 'sending' ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Enviar para Validação</>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
