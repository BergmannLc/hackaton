import React, { useState } from 'react';
import { Camera, BookOpen, Award, Lightbulb, Calendar, Flame, Clock, CalendarDays, ThumbsUp, Timer, CheckCircle, LogOut } from 'lucide-react';
import { Badge } from '../components/Badge';
import { SuggestionModal } from '../components/modals/SuggestionModal';

import { getDaysDifference } from '../services/mocks';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileView = ({ user, events, suggestions, onAddSuggestion, onEventClick, onLogout, setUser }) => {
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);


  const enrolledEvents = events.filter(e => e.isEnrolled);
  const completedEvents = enrolledEvents.filter(e => getDaysDifference(e.date) < 0);
  const scheduledEvents = enrolledEvents.filter(e => getDaysDifference(e.date) >= 0);
  const mySuggestions = suggestions.filter(s => s.student === user.name);

  scheduledEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  completedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      className="pb-24 pt-6 px-4 max-w-4xl mx-auto space-y-8"
    >
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/10 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 opacity-50"></div>
        <label className="relative cursor-pointer group z-10 block">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-slate-900 transition-all group-hover:opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"><Camera className="text-white drop-shadow-md" size={28} /></div>
          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center pointer-events-none"><CheckCircle size={12} className="text-white" /></div>
        </label>
        <div className="flex-1 relative z-10 pt-2">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-indigo-400 font-medium mb-1">{user.course}</p>
          <p className="text-slate-400 text-sm">Matrícula: 2023001</p>
        </div>
      </section>

      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-black/10 border border-slate-800">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none"><Award size={200} /></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-indigo-400" /> Suas Horas Complementares</h2>
        
        <div className="mb-8 relative z-10">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-indigo-400 tracking-tighter">{user.hoursCompleted}</span>
            <span className="text-xl text-slate-500 mb-1 font-medium">/ {user.totalHoursNeeded}h</span>
          </div>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-3 mt-4 overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(user.hoursCompleted / user.totalHoursNeeded) * 100}%` }} transition={{ duration: 1.5, delay: 0.2 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12"></div>
            </motion.div>
          </div>
          <p className="text-slate-400 text-sm mt-3 font-medium">Faltam <strong className="text-white">{user.totalHoursNeeded - user.hoursCompleted} horas</strong> para concluir o requisito.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 relative z-10 mt-6">
          <button onClick={() => setShowSuggestionModal(true)} className="bg-slate-900/80 hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group flex items-center gap-4 text-left shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0"><Lightbulb size={24} /></div>
            <div><h3 className="text-white font-bold text-sm sm:text-base mb-0.5">Sugerir Evento</h3><p className="text-slate-400 text-xs line-clamp-2">Conhece um evento legal? Envie sua ideia.</p></div>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="text-indigo-400" size={20} /> Agendados</h2>
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-3 py-1 rounded-full">{scheduledEvents.length} eventos</span>
        </div>
        {scheduledEvents.length > 0 ? (
          <div className="space-y-4">
            {scheduledEvents.map(event => {
              const daysUntil = getDaysDifference(event.date);
              const isApproaching = daysUntil <= 2;
              return (
                <motion.div layout key={event.id} onClick={() => onEventClick(event)} className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-sm transition-all cursor-pointer group relative overflow-hidden ${isApproaching ? 'bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10' : 'bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20'}`}>
                  {isApproaching && <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>}
                  <div className="w-full sm:w-32 h-32 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 relative">
                     <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="neutral">{event.category}</Badge>
                        {isApproaching ? (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse"><Flame size={12}/> {daysUntil === 0 ? 'É Hoje!' : `Faltam ${daysUntil} dias`}</span>
                        ) : (
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">Inscrito</span>
                        )}
                      </div>
                      <h3 className={`font-bold text-lg leading-tight transition-colors mt-1 ${isApproaching ? 'text-white group-hover:text-amber-400' : 'text-white group-hover:text-indigo-400'}`}>{event.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-400">
                      <span className={`flex items-center gap-1.5 ${isApproaching ? 'text-amber-200' : ''}`}><CalendarDays size={16} className={isApproaching ? 'text-amber-500' : 'text-slate-500'}/> {new Date(event.date + "T12:00:00").toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-500"/> {event.time}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800 border-dashed">
            <p className="text-slate-400 mb-4">Você não tem eventos agendados.</p>
          </div>
        )}
      </section>

      {mySuggestions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Lightbulb className="text-amber-400" size={20} /> Minhas Sugestões</h2>
          </div>
          <div className="space-y-4">
            {mySuggestions.map(sug => (
              <motion.div layout key={sug.id} className="bg-slate-900/50 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-base text-white mb-1 flex items-center gap-2">{sug.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1">{sug.description}</p>
                </div>
                <div>
                  {sug.status === 'aprovada' ? (
                     <Badge variant="success" className="flex items-center gap-1 whitespace-nowrap"><ThumbsUp size={12}/> Aprovada para Evento</Badge>
                  ) : (
                     <Badge variant="warning" className="flex items-center gap-1 whitespace-nowrap"><Timer size={12}/> Em análise</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2"><CheckCircle className="text-emerald-500" size={20} /> Histórico / Concluídos</h2>
        </div>
        
        {completedEvents.length > 0 ? (
          <div className="space-y-4">
            {completedEvents.map(event => (
              <motion.div layout key={event.id} onClick={() => onEventClick(event)} className="bg-slate-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all cursor-pointer group">
                <div className="w-full sm:w-24 h-24 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 relative grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                   <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle size={12}/> Concluído</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-300 leading-tight group-hover:text-white transition-colors mt-2">{event.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14}/> {new Date(event.date + "T12:00:00").toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400/80"><Award size={14}/> +{event.hours}h garantidas</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 rounded-3xl p-8 text-center border border-slate-800/50 border-dashed">
            <p className="text-slate-500">Nenhum evento concluído ainda.</p>
          </div>
        )}
      </section>

      <button onClick={onLogout} className="w-full mt-6 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-4 rounded-2xl border border-rose-500/20 transition-all font-bold flex items-center justify-center gap-2 shadow-sm">
        <LogOut size={20} /> Sair da Conta
      </button>
      
      <AnimatePresence>
        {showSuggestionModal && <SuggestionModal onClose={() => setShowSuggestionModal(false)} onSubmitIdea={(idea) => {
          onAddSuggestion(idea);
          setShowSuggestionModal(false);
        }} />}
      </AnimatePresence>
    </motion.div>
  );
};
