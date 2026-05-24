import React, { useState } from 'react';
import { CalendarDays, Plus, Edit2, MapPin, User, Lightbulb, CheckCircle, Inbox, ThumbsUp, Trash2, CalendarPlus, LogOut, Check, Award, Timer, MessageSquare, QrCode, UserPlus, Hash, Lock, Loader2, Building2 } from 'lucide-react';
import { Badge } from '../components/Badge';
import { EventFormModal } from '../components/modals/EventFormModal';
import { AttendanceProfModal } from '../components/modals/AttendanceProfModal';
import { MOCK_PROF } from '../services/mocks';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProfessorView = ({ activeTab, onLogout, events, setEvents, suggestions, setSuggestions }) => {
  const [sugTab, setSugTab] = useState('pendentes');

  const [professorsList, setProfessorsList] = useState([
    {
      id: 1,
      name: "Prof. Roberto Costa",
      department: "Coordenação de TI",
      avatar: "https://i.pravatar.cc/150?img=11",
      siape: "123456"
    },
    {
      id: 2,
      name: "Profa. Ana Lima",
      department: "Engenharia de Software",
      avatar: "https://i.pravatar.cc/150?img=47",
      siape: "654321"
    }
  ]);

  const [registerForm, setRegisterForm] = useState({
    name: '',
    siape: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterProfessor = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    setIsRegistering(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProf = {
        id: Date.now(),
        name: registerForm.name,
        department: registerForm.department,
        siape: registerForm.siape,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      };

      setProfessorsList(prev => [...prev, newProf]);
      toast.success("Professor cadastrado com sucesso!");
      
      setRegisterForm({
        name: '',
        siape: '',
        department: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error("Erro ao cadastrar professor.");
    } finally {
      setIsRegistering(false);
    }
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
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceEvent, setAttendanceEvent] = useState(null);

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

  if (activeTab === 'cadastro-professor') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="pb-24 pt-6 px-4 max-w-6xl mx-auto space-y-6"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserPlus className="text-indigo-400" /> Cadastrar Professor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Adicione novos docentes para gerenciar eventos e coordenar atividades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
            
            <form onSubmit={handleRegisterProfessor} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Nome completo do professor"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Matrícula / SIAPE</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={registerForm.siape}
                      onChange={(e) => setRegisterForm({ ...registerForm, siape: e.target.value })}
                      placeholder="SIAPE ou Matrícula"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Departamento</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={registerForm.department}
                      onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })}
                      placeholder="Ex: Engenharia de Software"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                      required
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Confirmar Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                      required
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <UserPlus size={18} /> Cadastrar Docente
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-white">Professores na Plataforma</h3>
            <p className="text-slate-400 text-xs">Abaixo estão os professores ativos que possuem controle administrativo.</p>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {professorsList.map((prof) => (
                <div key={prof.id} className="flex items-center gap-4 bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-800 p-4 rounded-2xl transition-all">
                  <img src={prof.avatar} alt={prof.name} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{prof.name}</h4>
                    <p className="text-amber-400 text-xs font-semibold truncate mt-0.5">{prof.department}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">SIAPE: {prof.siape}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold" title="Ativo">
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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
                     <div className="mt-auto grid grid-cols-2 gap-2">
                       <button onClick={() => {setAttendanceEvent(event); setIsAttendanceModalOpen(true);}} className="w-full py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm border border-indigo-500/20 shadow-sm">
                         <QrCode size={16}/> Presença
                       </button>
                       <button onClick={() => {setEditingEvent(event); setIsEventModalOpen(true);}} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm border border-slate-700">
                         <Edit2 size={16}/> Editar
                       </button>
                     </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
         </div>
         <AnimatePresence>
           {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} onSave={handleSaveEvent} />}
           {isAttendanceModalOpen && <AttendanceProfModal event={attendanceEvent} onClose={() => {setIsAttendanceModalOpen(false); setAttendanceEvent(null);}} onUpdateEvent={handleSaveEvent} />}
         </AnimatePresence>
      </motion.div>
    );
  }


  if (activeTab === 'tarefas') {
    const pendingSugs = suggestions.filter(s => s.status === 'pendente');
    const approvedSugs = suggestions.filter(s => s.status === 'aprovada');

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MessageSquare className="text-amber-400"/> Sugestões dos Alunos</h1>
          <p className="text-slate-400 text-sm mt-1">Avalie ideias da comunidade e transforme-as em eventos.</p>
        </div>

        <div className="flex gap-4 border-b border-slate-800 pb-2 mb-4 px-2">
          <button onClick={() => setSugTab('pendentes')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'pendentes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aguardando ({pendingSugs.length})</button>
          <button onClick={() => setSugTab('aprovadas')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'aprovadas' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aprovadas ({approvedSugs.length})</button>
        </div>

        {sugTab === 'pendentes' && (
          pendingSugs.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4"><Inbox size={40} /></div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma sugestão nova</h3>
              <p className="text-slate-400">As ideias dos alunos aparecerão aqui.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSugs.map(sug => (
                <div key={sug.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                    <img src={sug.avatar} alt={sug.student} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm text-slate-400">Enviado por <strong className="text-white">{sug.student}</strong></p>
                      <p className="text-xs text-slate-500">{sug.course}</p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb size={18} className="text-amber-400"/> {sug.title}</h4>
                    <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">{sug.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSuggestions(prev => prev.map(s => s.id === sug.id ? { ...s, status: 'aprovada' } : s));
                        toast.success('Ideia aprovada!');
                      }}
                      className="flex-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white py-3 rounded-xl transition-all font-bold flex justify-center items-center gap-2 shadow-sm"
                    >
                      <ThumbsUp size={18}/> Aprovar Ideia
                    </button>
                    <button
                      onClick={() => {
                        setSuggestions(prev => prev.filter(s => s.id !== sug.id));
                        toast.success('Ideia removida.');
                      }}
                      className="px-5 bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {sugTab === 'aprovadas' && (
          approvedSugs.length === 0 ? (
            <div className="text-center py-8"><p className="text-slate-500">Nenhuma ideia aprovada ainda.</p></div>
          ) : (
            <div className="space-y-4">
              {approvedSugs.map(sug => (
                <div key={sug.id} className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 transition-all shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <Badge variant="success" className="mb-2 inline-block"><CheckCircle size={12} className="inline mr-1"/> Aprovada</Badge>
                    <h4 className="text-white font-bold text-lg mb-1">{sug.title}</h4>
                    <p className="text-sm text-slate-400">Ideia de <strong className="text-slate-300">{sug.student}</strong></p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEvent({
                        title: sug.title,
                        description: sug.description,
                        suggestedBy: sug.student,
                        category: 'Palestras',
                        date: '',
                        time: '',
                        location: '',
                        hours: 2,
                        spots: 50,
                        speaker: '',
                        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
                        courses: ["Geral"],
                      });
                      setIsEventModalOpen(true);
                    }}
                    className="bg-slate-800 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
                    title="Transformar em Evento"
                  >
                    <CalendarPlus size={20}/>
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        <AnimatePresence>
          {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => { setIsEventModalOpen(false); setEditingEvent(null); }} onSave={handleSaveEvent} />}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ============ Default: Painel ============
  const pendingCount = suggestions.filter(s => s.status === 'pendente').length;
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white tracking-tight">Olá, <span className="text-amber-400">{MOCK_PROF.name.split(' ')[1]}</span></h1>
        <p className="text-slate-400 mt-1 text-lg">Resumo das atividades e pendências do sistema hoje.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20"><MessageSquare size={24}/></div>
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1">Novas Ideias</h3>
          <div className="text-4xl font-black text-white">{pendingCount} <span className="text-lg font-medium text-slate-500">sugestões</span></div>
        </div>
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-900/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20"><CalendarDays size={24}/></div>
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1">Eventos Cadastrados</h3>
          <div className="text-4xl font-black text-white">{events.length} <span className="text-lg font-medium text-slate-500">eventos</span></div>
        </div>
        <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-900/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20"><UserPlus size={24}/></div>
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1">Professores</h3>
          <div className="text-4xl font-black text-white">{professorsList.length} <span className="text-lg font-medium text-slate-500">cadastrados</span></div>
        </div>
      </div>
    </motion.div>
  );
};
