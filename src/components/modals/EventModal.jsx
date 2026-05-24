import React from 'react';
import { X, CalendarDays, MapPin, Award, Timer, Lightbulb, User } from 'lucide-react';
import { Badge } from '../Badge';
import { getDaysDifference } from '../../services/mocks';
import { motion } from 'framer-motion';

export const EventModal = ({ event, onClose, onEnroll }) => {
  if (!event) return null;
  const isFull = event.enrolled >= event.spots;
  const daysUntil = getDaysDifference(event.date);
  const isApproaching = daysUntil >= 0 && daysUntil <= 2;
  const isPast = daysUntil < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 border ${isApproaching ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-slate-800'}`}
      >
        <div className="relative h-64 flex-shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10"><X size={16}/></button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="primary" className="bg-slate-900/50 text-white backdrop-blur-md border-white/10">{event.category}</Badge>
              {isApproaching && !isPast && <Badge variant="warning" className="animate-pulse"><Timer size={12} className="inline mr-1"/> Faltam {daysUntil} dias</Badge>}
              {isPast && <Badge variant="neutral" className="bg-slate-800/80 text-white">Evento Concluído</Badge>}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{event.title}</h2>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow bg-slate-950/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-6">
              {event.suggestedBy && (
                 <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 flex-shrink-0"><Lightbulb size={20} /></div>
                    <div>
                      <h4 className="text-amber-400 font-bold mb-0.5">Ideia da Comunidade</h4>
                      <p className="text-sm text-slate-300">Sugerido por <strong className="text-white">{event.suggestedBy}</strong>!</p>
                    </div>
                 </div>
              )}
              <div><h3 className="text-lg font-bold text-white mb-2">Sobre o evento</h3><p className="text-slate-300 leading-relaxed">{event.description}</p></div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 flex-shrink-0"><User size={24} /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Palestrante</p><p className="font-bold text-white">{event.speaker}</p></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className={`bg-slate-900 p-4 rounded-2xl border shadow-sm space-y-4 ${isApproaching ? 'border-amber-500/30' : 'border-slate-800'}`}>
                <div className="flex items-start gap-3"><CalendarDays className={`${isApproaching ? 'text-amber-500' : 'text-indigo-400'} flex-shrink-0`} size={20} /><div><p className={`text-sm font-semibold ${isApproaching ? 'text-amber-400' : 'text-white'}`}>{new Date(event.date + "T12:00:00").toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p><p className="text-xs text-slate-400">{event.time}</p></div></div>
                <div className="flex items-start gap-3"><MapPin className="text-indigo-400 flex-shrink-0" size={20} /><div><p className="text-sm font-semibold text-white">Local</p><p className="text-xs text-slate-400 leading-tight">{event.location}</p></div></div>
                <div className="flex items-start gap-3"><Award className="text-indigo-400 flex-shrink-0" size={20} /><div><p className="text-sm font-semibold text-white">Horas</p><p className="text-xs text-slate-400">{event.hours} horas garantidas</p></div></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
             <div className="text-sm text-slate-400 mb-1 font-medium">Ocupação das vagas</div>
             <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${isFull ? 'bg-rose-500' : isApproaching ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${(event.enrolled / event.spots) * 100}%` }}></div></div>
             <div className="text-xs text-slate-400 mt-1 font-medium"><span className="text-white">{event.enrolled}</span> / {event.spots} inscritos</div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {!isPast && (
              <button onClick={() => onEnroll(event.id)} disabled={isFull && !event.isEnrolled}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold transition-all shadow-sm ${event.isEnrolled ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700' : isFull ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : isApproaching ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {event.isEnrolled ? 'Cancelar Inscrição' : isFull ? 'Vagas Esgotadas' : 'Garantir Vaga'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
