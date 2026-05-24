import React from 'react';
import { CalendarDays, MapPin, CheckCircle, Flame, Award, Lightbulb } from 'lucide-react';
import { Badge } from './Badge';
import { getDaysDifference } from '../services/mocks';
import { motion } from 'framer-motion';

export const EventCard = ({ event, onEnroll, onClick }) => {
  const isFull = event.enrolled >= event.spots;
  const daysUntil = getDaysDifference(event.date);
  const isApproaching = daysUntil >= 0 && daysUntil <= 2;
  const isPast = daysUntil < 0;
  
  const containerClasses = isApproaching
    ? "bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
    : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col relative ${containerClasses}`} 
      onClick={() => onClick(event)}
    >
      {isApproaching && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>}
      <div className="relative h-48 overflow-hidden">
        <img src={event.image} alt={event.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 ${isPast ? 'grayscale opacity-60' : ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="primary" className="shadow-sm">{event.category}</Badge>
          {event.isEnrolled && !isPast && <Badge variant="success" className="shadow-sm flex items-center gap-1"><CheckCircle size={12} /> Inscrito</Badge>}
          {isPast && <Badge variant="neutral" className="shadow-sm flex items-center gap-1 bg-slate-900/90"><CheckCircle size={12} /> Concluído</Badge>}
        </div>
        {isApproaching && !event.isEnrolled && !isPast && (
          <div className="absolute top-3 right-3">
             <Badge variant="warning" className="flex items-center gap-1 animate-pulse"><Flame size={12} /> {daysUntil === 0 ? 'É Hoje!' : `Faltam ${daysUntil} dias`}</Badge>
          </div>
        )}
        {(!isApproaching || event.isEnrolled || isPast) && (
          <div className="absolute top-3 right-3">
            <div className="bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/50 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm"><Award size={14} className="text-indigo-400" /> {event.hours}h</div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow relative z-10">
        <h3 className={`font-bold text-lg leading-tight mb-2 transition-colors ${isApproaching ? 'text-white group-hover:text-amber-400' : 'text-white group-hover:text-indigo-400'}`}>{event.title}</h3>
        <div className="space-y-2 mt-auto pt-2">
          {event.suggestedBy && (
            <div className="mb-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md inline-flex items-center gap-1.5"><Lightbulb size={12} /> Sugerido por {event.suggestedBy}</div>
          )}
          <div className="flex items-center text-sm text-slate-400">
            <CalendarDays size={16} className={`mr-2 ${isApproaching ? 'text-amber-500' : 'text-slate-500'}`} />
            <span className={isApproaching ? 'text-amber-400 font-medium' : ''}>{new Date(event.date + "T12:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-slate-400"><MapPin size={16} className="mr-2 text-slate-500 flex-shrink-0" /><span className="truncate">{event.location}</span></div>
        </div>
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="text-xs text-slate-400 font-medium">
            {isPast ? <span className="text-slate-500">Evento finalizado</span> : <><span className={isFull ? "text-rose-400 font-bold" : "text-emerald-400"}>{event.spots - event.enrolled}</span> vagas restantes</>}
          </div>
          {!isPast && (
            <button onClick={(e) => { e.stopPropagation(); onEnroll(event.id); }} disabled={isFull && !event.isEnrolled}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${event.isEnrolled ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700' : isFull ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800' : isApproaching ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {event.isEnrolled ? 'Cancelar' : isFull ? 'Esgotado' : 'Participar'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
