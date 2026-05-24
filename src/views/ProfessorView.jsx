import React, { useState } from 'react';
import { CalendarDays, Plus, Edit2, MapPin, User, FileCheck, Lightbulb, CheckCircle, Inbox, ThumbsUp, Trash2, CalendarPlus, LogOut, Check, Eye, Award, FileText, Timer, MessageSquare } from 'lucide-react';
import { Badge } from '../components/Badge';
import { EventFormModal } from '../components/modals/EventFormModal';
import { MOCK_PROF } from '../services/mocks';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProfessorView = ({ activeTab, onLogout, events, setEvents, certs, setCerts, suggestions, setSuggestions }) => {
  const [taskType, setTaskType] = useState('certificados');
  const [sugTab, setSugTab] = useState('pendentes');

  const handleApproveCert = (id) => {
    setCerts(prev => prev.filter(c => c.id !== id));
    toast.success("Certificado validado e horas computadas!");
  };
  const handleRejectCert = (id) => {
    setCerts(prev => prev.filter(c => c.id !== id));
    toast.success("Certificado rejeitado.");
  };
  
  const handleApproveSug = (id) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'aprovada' } : s));
    toast.success("Ideia aprovada para votação/evento!");
  };
  const handleRejectSug = (id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    toast.success("Ideia removida.");
  };

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
       setEvents(events.map(e => e.id === eventData.id ? eventData : e));
    } else {
       setEvents([...events, { ...eventData, id: Date.now(), enrolled: 0, isEnrolled: false }]);
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (activeTab === 'perfil') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-4xl mx-auto space-y-8">
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/10 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-amber-900/40 to-rose-900/40 opacity-50"></div>
          <div className="relative">
            <img src={MOCK_PROF.avatar} alt={MOCK_PROF.name} className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-slate-900" />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1 relative z-10 pt-2">
            <h1 className="text-2xl font-bold text-white">{MOCK_PROF.name}</h1>
            <p className="text-amber-400 font-medium mb-1">{MOCK_PROF.department}</p>
            <p className="text-slate-400 text-sm">Administrador do Sistema</p>
          </div>
        </section>
        <button onClick={onLogout} className="w-full mt-6 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-4 rounded-2xl border border-rose-500/20 transition-all font-bold flex items-center justify-center gap-2 shadow-sm">
          <LogOut size={20} /> Sair da Conta
        </button>
      </motion.div>
    );
  }

  if (activeTab === 'eventos') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
           <div>
             <h1 className="text-2xl font-bold text-white flex items-center gap-2"><CalendarDays className="text-indigo-400"/> Gestão de Eventos</h1>
             <p className="text-slate-400 text-sm mt-1">Crie e gerencie os eventos disponíveis na universidade.</p>
           </div>
           <button onClick={() => {setEditingEvent(null); setIsEventModalOpen(true);}} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
             <Plus size={20}/> Novo Evento
           </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {events.map(event => (
                <motion.div layout key={event.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col group shadow-sm hover:border-slate-700 transition-all">
                   <div className="h-32 w-full relative">
                     <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                     <Badge variant="primary" className="absolute top-3 left-3">{event.category}</Badge>
                   </div>
                   <div className="p-5 flex flex-col flex-1">
                     <h3 className="font-bold text-lg text-white leading-tight mb-2">{event.title}</h3>
                     <div className="text-sm text-slate-400 space-y-1 mb-4">
                       <p className="flex items-center gap-2"><CalendarDays size={14}/> {new Date(event.date + "T12:00:00").toLocaleDateString('pt-BR')} • {event.time}</p>
                       <p className="flex items-center gap-2"><MapPin size={14}/> {event.location}</p>
                       <p className="flex items-center gap-2"><User size={14}/> {event.enrolled} / {event.spots} inscritos</p>
                     </div>
                     <button onClick={() => {setEditingEvent(event); setIsEventModalOpen(true);}} className="mt-auto w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm border border-slate-700">
                       <Edit2 size={16}/> Editar Evento
                     </button>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
         </div>
         <AnimatePresence>
           {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} onSave={handleSaveEvent} />}
         </AnimatePresence>
      </motion.div>
    );
  }

  if (activeTab === 'tarefas') {
    const pendingSugs = suggestions.filter(s => s.status === 'pendente');
    const approvedSugs = suggestions.filter(s => s.status === 'aprovada');

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-5xl mx-auto space-y-6">
         <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button onClick={() => setTaskType('certificados')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${taskType === 'certificados' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
              <FileCheck size={18}/> Certificados 
              {certs.length > 0 && <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-xs">{certs.length}</span>}
            </button>
            <button onClick={() => setTaskType('sugestoes')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${taskType === 'sugestoes' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
              <Lightbulb size={18}/> Sugestões
              {pendingSugs.length > 0 && <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-xs">{pendingSugs.length}</span>}
            </button>
         </div>

         <AnimatePresence mode="wait">
         {taskType === 'certificados' ? (
            <motion.div key="cert" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
               {certs.length === 0 ? (
                  <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4"><CheckCircle size={40} /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Caixa de Entrada Limpa!</h3>
                    <p className="text-slate-400">Todos os certificados já foram validados.</p>
                  </div>
               ) : (
                 <AnimatePresence>
                   {certs.map(cert => (
                     <motion.div layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, height: 0, marginBottom: 0}} key={cert.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                           <div className="flex gap-4 items-center">
                              <img src={cert.avatar} alt={cert.student} className="w-14 h-14 rounded-full border-2 border-slate-800" />
                              <div>
                                 <h4 className="text-white font-bold text-lg leading-tight">{cert.student}</h4>
                                 <p className="text-sm text-slate-400">{cert.course}</p>
                              </div>
                           </div>
                           <Badge variant="warning" className="flex items-center gap-1 text-sm py-1"><Timer size={14}/> {cert.hours}h Solicitadas</Badge>
                        </div>
                        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 mb-5">
                           <p className="text-slate-300 font-bold mb-1 flex items-center gap-2"><Award size={16} className="text-indigo-400"/> {cert.event}</p>
                           <div className="flex items-center justify-between mt-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                             <p className="text-xs text-slate-400 flex items-center gap-2 truncate"><FileText size={16} className="text-emerald-400 flex-shrink-0"/> {cert.file}</p>
                             <button className="text-indigo-400 font-bold text-xs hover:text-indigo-300 flex items-center gap-1 flex-shrink-0 bg-indigo-500/10 px-3 py-1.5 rounded-lg ml-2"><Eye size={14}/> PDF</button>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <button onClick={() => handleApproveCert(cert.id)} className="flex-1 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 py-3 rounded-xl transition-all font-bold flex justify-center items-center gap-2 shadow-sm">
                               <Check size={18}/> Validar Horas
                           </button>
                           <button onClick={() => handleRejectCert(cert.id)} className="px-5 bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center">
                               <Trash2 size={18}/>
                           </button>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               )}
            </motion.div>
         ) : (
            <motion.div key="sug" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
               <div className="flex gap-4 border-b border-slate-800 pb-2 mb-4 px-2">
                 <button onClick={() => setSugTab('pendentes')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'pendentes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aguardando ({pendingSugs.length})</button>
                 <button onClick={() => setSugTab('aprovadas')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'aprovadas' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aprovadas ({approvedSugs.length})</button>
               </div>

               <AnimatePresence mode="wait">
               {sugTab === 'pendentes' && (
                 pendingSugs.length === 0 ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4"><Inbox size={40} /></div>
                      <h3 className="text-xl font-bold text-white mb-2">Nenhuma sugestão nova</h3>
                      <p className="text-slate-400">As ideias dos alunos aparecerão aqui.</p>
                    </motion.div>
                 ) : (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                     <AnimatePresence>
                     {pendingSugs.map(sug => (
                       <motion.div layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, height: 0, marginBottom: 0}} key={sug.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm">
                          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                             <img src={sug.avatar} alt={sug.student} className="w-10 h-10 rounded-full" />
                             <div><p className="text-sm text-slate-400">Enviado por <strong className="text-white">{sug.student}</strong></p><p className="text-xs text-slate-500">{sug.course}</p></div>
                          </div>
                          <div className="mb-5">
                             <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb size={18} className="text-amber-400"/> {sug.title}</h4>
                             <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">{sug.description}</p>
                          </div>
                          <div className="flex gap-3">
                             <button onClick={() => handleApproveSug(sug.id)} className="flex-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white py-3 rounded-xl transition-all font-bold flex justify-center items-center gap-2 shadow-sm">
                                 <ThumbsUp size={18}/> Aprovar Ideia
                             </button>
                             <button onClick={() => handleRejectSug(sug.id)} className="px-5 bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center">
                                 <Trash2 size={18}/>
                             </button>
                          </div>
                       </motion.div>
                     ))}
                     </AnimatePresence>
                   </motion.div>
                 )
               )}

               {sugTab === 'aprovadas' && (
                 approvedSugs.length === 0 ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center py-8"><p className="text-slate-500">Nenhuma ideia aprovada ainda.</p></motion.div>
                 ) : (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                     {approvedSugs.map(sug => (
                       <motion.div layout key={sug.id} className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 transition-all shadow-sm flex items-center justify-between gap-4">
                          <div>
                             <Badge variant="success" className="mb-2 inline-block"><CheckCircle size={12} className="inline mr-1"/> Aprovada</Badge>
                             <h4 className="text-white font-bold text-lg mb-1">{sug.title}</h4>
                             <p className="text-sm text-slate-400">Ideia de <strong className="text-slate-300">{sug.student}</strong></p>
                          </div>
                          <button 
                            onClick={() => {
                              setEditingEvent({
                                 title: sug.title, description: sug.description, suggestedBy: sug.student, category: 'Palestras',
                                 date: '', time: '', location: '', hours: 2, spots: 50, speaker: '',
                                 image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', courses: ["Geral"]
                              });
                              setIsEventModalOpen(true);
                            }} 
                            className="bg-slate-800 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm" title="Transformar em Evento"
                          >
                             <CalendarPlus size={20}/>
                          </button>
                       </motion.div>
                     ))}
                   </motion.div>
                 )
               )}
               </AnimatePresence>
            </motion.div>
         )}
         </AnimatePresence>
         <AnimatePresence>
           {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} onSave={handleSaveEvent} />}
         </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white tracking-tight">Olá, <span className="text-amber-400">{MOCK_PROF.name.split(' ')[1]}</span></h1>
        <p className="text-slate-400 mt-1 text-lg">Resumo das atividades e pendências do sistema hoje.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-900/30 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20"><FileCheck size={24}/></div>
            <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1">Aguardando Validação</h3>
            <div className="text-4xl font-black text-white">{certs.length} <span className="text-lg font-medium text-slate-500">certificados</span></div>
         </div>
         <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20"><MessageSquare size={24}/></div>
            <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1">Novas Ideias</h3>
            <div className="text-4xl font-black text-white">{suggestions.filter(s=>s.status==='pendente').length} <span className="text-lg font-medium text-slate-500">sugestões</span></div>
         </div>
      </div>
    </motion.div>
  );
};
