import React, { useState, useEffect } from 'react';
import { Home, User, LayoutDashboard, CalendarPlus, CheckSquare } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { ProfessorView } from './views/ProfessorView';
import { EventModal } from './components/modals/EventModal';

import { INITIAL_EVENTS, INITIAL_SUGGESTIONS, INITIAL_CERTS } from './services/mocks';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('aluno');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  const [events, setEvents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [certs, setCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      setEvents(INITIAL_EVENTS);
      setSuggestions(INITIAL_SUGGESTIONS);
      setCerts(INITIAL_CERTS);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setUserRole(loggedUser.role || 'aluno');
    setIsAuthenticated(true);
    setActiveTab(loggedUser.role === 'professor' ? 'painel' : 'home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserRole('aluno');
    setActiveTab('home');
    toast('Você saiu da conta.', { icon: '👋' });
  };

  const handleEnroll = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        if (event.isEnrolled) {
          toast('Inscrição cancelada.');
          return { ...event, isEnrolled: false, enrolled: event.enrolled - 1 };
        } else if (event.enrolled < event.spots) {
          toast.success('Inscrição confirmada com sucesso!');
          return { ...event, isEnrolled: true, enrolled: event.enrolled + 1 };
        }
      }
      return event;
    }));
  };

  const handleAddSuggestion = (idea) => {
    const newSug = {
      id: Date.now(),
      title: idea.title,
      description: idea.description,
      student: user.name,
      course: user.course,
      avatar: user.avatar,
      status: 'pendente'
    };
    setSuggestions([...suggestions, newSug]);
    toast.success('Sua sugestão foi enviada para análise!');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" />
        <AnimatePresence mode="wait">
          <AuthView key="auth" onLogin={handleLogin} />
        </AnimatePresence>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-white font-bold text-xl">Carregando FlowUp...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
      }} />

      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 px-4 h-[72px] md:h-[88px] flex items-center sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-xl md:text-2xl font-longshot text-white flex items-center gap-2 tracking-wide">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            Flow<span className="text-indigo-500">Up</span>
          </h1>
          {userRole === 'aluno' && user && (
            <div onClick={() => setActiveTab('perfil')} className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-colors ${activeTab === 'perfil' ? 'border-indigo-500' : 'border-slate-700 hover:border-indigo-500'}`}>
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </header>

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {userRole === 'aluno' ? (
            activeTab === 'home' ? (
              <HomeView key="home" events={events} onEnroll={handleEnroll} onEventClick={setSelectedEvent} />
            ) : (
              <ProfileView key="profile" user={user} events={events} suggestions={suggestions} onAddSuggestion={handleAddSuggestion} onEventClick={setSelectedEvent} onLogout={handleLogout} setUser={setUser} />
            )
          ) : (
            <ProfessorView key="professor" activeTab={activeTab} onLogout={handleLogout} events={events} setEvents={setEvents} certs={certs} setCerts={setCerts} suggestions={suggestions} setSuggestions={setSuggestions} />
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/80 pb-safe z-40">
        <div className="max-w-md mx-auto px-6 py-3">
          <ul className="flex justify-between items-center">
            {userRole === 'aluno' ? (
              <>
                <li>
                  <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Home size={24} className={activeTab === 'home' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Explorar</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'perfil' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <User size={24} className={activeTab === 'perfil' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Meu Perfil</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => setActiveTab('painel')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'painel' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <LayoutDashboard size={24} className={activeTab === 'painel' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Painel</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('eventos')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'eventos' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <CalendarPlus size={24} className={activeTab === 'eventos' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Eventos</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tarefas')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'tarefas' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300 relative'}`}>
                    <CheckSquare size={24} className={activeTab === 'tarefas' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Tarefas</span>
                    {(certs.length + suggestions.filter(s => s.status === 'pendente').length) > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'perfil' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <User size={24} className={activeTab === 'perfil' ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
                    <span className="text-[10px] font-bold mt-1">Perfil</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <AnimatePresence>
        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onEnroll={handleEnroll} />}
      </AnimatePresence>
    </div>
  );
}

export default App;