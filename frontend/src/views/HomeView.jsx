import React, { useState, useEffect } from 'react';
import { Search, Filter, CalendarDays, MapPin, Award, Timer, Flame, Sparkles, CheckCircle } from 'lucide-react';
import { Badge } from '../components/Badge';
import { EventCard } from '../components/EventCard';
import { getDaysDifference, CATEGORIES, COURSES } from '../services/mocks';
import { motion, AnimatePresence } from 'framer-motion';

export const HomeView = ({ events, onEnroll, onEventClick }) => {
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingEvents = sortedEvents.filter(e => getDaysDifference(e.date) >= 0);
  
  useEffect(() => {
    if (upcomingEvents.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % upcomingEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  const heroEvent = upcomingEvents.length > 0 ? upcomingEvents[heroIndex] : (events.length > 0 ? events[0] : null);

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategory === 'Todos' || event.category === filterCategory;
    const matchesCourse = filterCourse === 'Todos' || event.courses.includes(filterCourse) || event.courses.includes('Geral');
    const matchesDate = !filterDate || event.date === filterDate;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCourse && matchesDate && matchesSearch;
  });

  const isFiltering = filterCategory !== 'Todos' || filterCourse !== 'Todos' || filterDate !== '' || searchQuery !== '';
  const upcomingFiltered = filteredEvents.filter(e => getDaysDifference(e.date) >= 0 && getDaysDifference(e.date) <= 7);
  const otherFiltered = filteredEvents.filter(e => getDaysDifference(e.date) < 0 || getDaysDifference(e.date) > 7);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pb-24 pt-4 sm:pt-6 px-4 max-w-7xl mx-auto space-y-8"
    >
      
      <AnimatePresence mode="wait">
      {heroEvent && (
        <motion.section 
          key={heroEvent.id}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}
          className="relative w-full rounded-[2rem] overflow-hidden border border-slate-800/60 shadow-2xl shadow-indigo-900/20 group cursor-pointer" 
          onClick={() => onEventClick(heroEvent)}
        >
          <div className="absolute inset-0 bg-slate-900">
             <img src={heroEvent.image} alt={heroEvent.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end min-h-[340px] sm:min-h-[400px]">
             <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 backdrop-blur-md border-indigo-500/30 px-3 py-1 text-sm">{heroEvent.category}</Badge>
                {getDaysDifference(heroEvent.date) <= 2 && getDaysDifference(heroEvent.date) >= 0 && (
                   <Badge variant="warning" className="animate-pulse px-3 py-1 text-sm"><Flame size={14} className="inline mr-1"/> Faltam {getDaysDifference(heroEvent.date)} dias</Badge>
                )}
             </div>
             <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3 group-hover:text-indigo-200 transition-colors">{heroEvent.title}</h1>
             <p className="text-slate-300 text-sm sm:text-base max-w-2xl line-clamp-2 mb-6">{heroEvent.description}</p>
             
             <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300 font-medium mb-6">
                <span className="flex items-center gap-2"><CalendarDays size={18} className="text-indigo-400"/> {new Date(heroEvent.date + "T12:00:00").toLocaleDateString('pt-BR')} • {heroEvent.time}</span>
                <span className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400"/> {heroEvent.location}</span>
                <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 backdrop-blur-sm"><Award size={16} className="text-emerald-400"/> {heroEvent.hours}h garantidas</span>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 sm:items-center mt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEnroll(heroEvent.id); }}
                  disabled={heroEvent.enrolled >= heroEvent.spots && !heroEvent.isEnrolled}
                  className={`px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${heroEvent.isEnrolled ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700' : (heroEvent.enrolled >= heroEvent.spots) ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-600/25 hover:-translate-y-0.5'}`}
                >
                  {heroEvent.isEnrolled ? 'Cancelar Inscrição' : (heroEvent.enrolled >= heroEvent.spots) ? 'Esgotado' : <><CheckCircle size={18} /> Garantir Vaga</>}
                </button>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">
                  {heroEvent.enrolled >= heroEvent.spots ? 'As vagas esgotaram :(' : <><strong className="text-white">{heroEvent.spots - heroEvent.enrolled} vagas</strong> restantes de {heroEvent.spots}</>}
                </span>
             </div>
          </div>
        </motion.section>
      )}
      </AnimatePresence>

      <section className="sticky top-[72px] md:top-[88px] z-30 bg-slate-950/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input 
              type="text" placeholder="Pesquisar por tecnologias, eventos, palestrantes..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${showFilters ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900/80 backdrop-blur-sm text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'}`}
          >
            <Filter size={20} /> <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mask-image-fade">
           {CATEGORIES.map(category => (
              <button 
                 key={category} 
                 onClick={() => setFilterCategory(category)}
                 className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${filterCategory === category ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
              >
                 {category}
              </button>
           ))}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-5 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5 shadow-2xl shadow-black/50 relative z-20 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Curso Recomendado</label>
                <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Data Específica</label>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" style={{ colorScheme: 'dark' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {filteredEvents.length > 0 ? (
        <div className="space-y-10">
           {(!filterDate && upcomingFiltered.length > 0) && (
             <section>
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"><Timer className="text-amber-500" size={24} /> Esta Semana</h2>
               </div>
               <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 <AnimatePresence>
                   {upcomingFiltered.map(event => <EventCard key={event.id} event={event} onEnroll={onEnroll} onClick={onEventClick} />)}
                 </AnimatePresence>
               </motion.div>
             </section>
           )}

           {(otherFiltered.length > 0 || filterDate) && (
             <section>
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    {filterDate ? <Search className="text-indigo-400" size={24}/> : <Sparkles className="text-indigo-400" size={24} />} 
                    {filterDate ? 'Resultados da Busca' : 'Descubra Mais'}
                 </h2>
               </div>
               <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 <AnimatePresence>
                   {(filterDate ? filteredEvents : otherFiltered).map(event => <EventCard key={event.id} event={event} onEnroll={onEnroll} onClick={onEventClick} />)}
                 </AnimatePresence>
               </motion.div>
             </section>
           )}
        </div>
      ) : (
        <section className="bg-slate-900/50 rounded-[2rem] p-12 text-center border border-slate-800/80 border-dashed flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-6"><Search size={32} /></div>
          <h3 className="text-2xl font-bold text-white mb-2">Nenhum evento encontrado</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">Não conseguimos encontrar eventos que correspondam aos seus filtros atuais. Que tal tentar termos diferentes ou limpar a busca?</p>
          <button onClick={() => {setSearchQuery(''); setFilterCategory('Todos'); setFilterCourse('Todos'); setFilterDate('');}} className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl transition-all font-bold">
             Limpar Todos os Filtros
          </button>
        </section>
      )}
    </motion.div>
  );
};
