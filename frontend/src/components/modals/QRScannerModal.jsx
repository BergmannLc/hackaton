import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, QrCode, CheckCircle, Loader2 } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';

export const QRScannerModal = ({ event, onClose, onScanSuccess }) => {
  const [status, setStatus] = useState('scanning'); // scanning, loading, success

  const handleScan = (text) => {
    if (status !== 'scanning') return;
    
    try {
      const data = JSON.parse(text);
      if (data.eventId === event.id && data.secret === 'flowup-hackathon-2024') {
        setStatus('loading');
        // Simula o delay de validar na API
        setTimeout(() => {
          setStatus('success');
          onScanSuccess();
          toast.success(`Presença confirmada no evento: ${event.title}!`, { duration: 4000 });
          setTimeout(() => onClose(), 2000);
        }, 1500);
      } else {
        toast.error('QR Code inválido para este evento.');
      }
    } catch (e) {
      toast.error('Formato de QR Code desconhecido.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-slate-900 w-full max-w-md rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 text-center relative z-10 bg-gradient-to-b from-slate-900 to-transparent">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"><X size={20}/></button>
          <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4 border border-indigo-500/20"><QrCode size={32}/></div>
          <h2 className="text-2xl font-bold text-white">Ler QR Code</h2>
          <p className="text-slate-400 mt-2 text-sm">Aponte a câmera para o QR Code projetado pelo professor para registrar sua presença.</p>
        </div>

        <div className="p-6 pt-0 flex justify-center relative">
           {status === 'scanning' && (
             <div className="w-full aspect-square rounded-3xl overflow-hidden border-4 border-indigo-500/30 relative shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <Scanner onScan={(result) => handleScan(result[0]?.rawValue)} />
                <div className="absolute inset-0 border-2 border-indigo-500/50 animate-pulse pointer-events-none rounded-3xl"></div>
             </div>
           )}

           {status === 'loading' && (
             <div className="w-full aspect-square bg-slate-950 rounded-3xl flex flex-col items-center justify-center border-2 border-indigo-500/30">
               <Loader2 className="text-indigo-400 animate-spin mb-4" size={48} />
               <p className="text-indigo-300 font-bold animate-pulse">Validando presença...</p>
             </div>
           )}

           {status === 'success' && (
             <div className="w-full aspect-square bg-emerald-950/50 rounded-3xl flex flex-col items-center justify-center border-2 border-emerald-500/50">
               <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                 <CheckCircle size={48} />
               </div>
               <h3 className="text-emerald-400 font-black text-2xl mb-2">Presença Confirmada!</h3>
               <p className="text-emerald-500/80 font-medium">Você ganhou +{event.hours} horas.</p>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};
