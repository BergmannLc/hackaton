import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Filter, MapPin, Clock, Award, CheckCircle, Home, User, Bell,
  BookOpen, Share2, CalendarDays, Zap, Timer, Flame, Lightbulb, UploadCloud,
  FileText, X, Send, GraduationCap, Briefcase, Lock, Hash, Loader2, LogOut, Check,
  LayoutDashboard, CheckSquare, Inbox, Eye, Trash2, FileCheck, ThumbsUp, Plus, Edit2,
  CalendarPlus, MessageSquare, Save, Camera
} from 'lucide-react';

const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getDaysDifference = (eventDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(eventDateStr + "T00:00:00");
  return Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
};

const CATEGORIES = ["Todos", "Palestras", "Workshops", "Hackathons", "Seminários"];
const COURSES = ["Todos", "Engenharia de Software", "Engenharia Civil", "Ciência da Computação", "Design", "Geral"];

const MOCK_USER = {
  name: "Mariana Silva",
  course: "Engenharia de Software",
  semester: "6º Semestre",
  totalHoursNeeded: 120,
  hoursCompleted: 85,
  avatar: "https://i.pravatar.cc/150?img=5",
  notifications: 3
};

const MOCK_PROF = {
  name: "Prof. Roberto Costa",
  department: "Coordenação de TI",
  avatar: "https://i.pravatar.cc/150?img=11"
};

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "O Futuro da IA na Engenharia",
    category: "Palestras",
    date: getRelativeDate(1),
    time: "14:00 - 16:00",
    location: "Auditório Principal, Bloco A",
    hours: 2,
    spots: 50,
    enrolled: 45,
    speaker: "Dr. Roberto Costa",
    description: "Uma visão aprofundada sobre como a Inteligência Artificial está remodelando os processos.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    courses: ["Engenharia de Software", "Engenharia Civil"]
  },
  {
    id: 2,
    title: "Workshop: React Avançado",
    category: "Workshops",
    date: getRelativeDate(5),
    time: "09:00 - 12:00",
    location: "Laboratório 3, Bloco C",
    hours: 3,
    spots: 30,
    enrolled: 30,
    speaker: "Profa. Ana Lima",
    description: "Aprenda padrões avançados do React, otimização de performance e gerenciamento de estado.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    courses: ["Engenharia de Software", "Ciência da Computação"]
  }
];

const INITIAL_CERTS = [
  { id: 101, student: "Lucas Moraes", avatar: "https://i.pravatar.cc/150?img=12", course: "Engenharia de Software", event: "Curso Intensivo de Python (Udemy)", hours: 40, file: "certificado_python.pdf", date: getRelativeDate(-1) },
];

const INITIAL_SUGGESTIONS = [
  { id: 201, student: "Mariana Silva", avatar: "https://i.pravatar.cc/150?img=5", course: "Engenharia de Software", title: "Workshop de Figma Avançado", description: "Muitos alunos têm dificuldade em prototipar. Um workshop focado nisso ajudaria muito.", date: getRelativeDate(0), status: 'pendente' },
];

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700'
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const EventCard = ({ event, onEnroll, onClick }) => {
  const isFull = event.enrolled >= event.spots;
  const daysUntil = getDaysDifference(event.date);
  const isApproaching = daysUntil >= 0 && daysUntil <= 2;
  const isPast = daysUntil < 0;
  
  const containerClasses = isApproaching
    ? "bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
    : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20";

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col relative ${containerClasses}`} onClick={() => onClick(event)}>
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
    </div>
  );
};

const SuggestionModal = ({ onClose, onSubmitIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIdea({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-md relative z-10 border border-slate-800 animate-in zoom-in-95 duration-200">
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
      </div>
    </div>
  );
};

const CertificateModal = ({ onClose }) => {
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
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-md relative z-10 border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><UploadCloud className="text-emerald-400" /> Enviar Certificado</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        
        {status === 'success' ? (
          <div className="text-center py-8 animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4"><CheckCircle size={40} /></div>
            <h3 className="text-xl font-bold text-white mb-2">Enviado com Sucesso!</h3>
            <p className="text-slate-400">Seu certificado foi enviado para análise da coordenação.</p>
          </div>
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
      </div>
    </div>
  );
};

const EventModal = ({ event, onClose, onEnroll }) => {
  if (!event) return null;
  const isFull = event.enrolled >= event.spots;
  const daysUntil = getDaysDifference(event.date);
  const isApproaching = daysUntil >= 0 && daysUntil <= 2;
  const isPast = daysUntil < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200 border ${isApproaching ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-slate-800'}`}>
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
      </div>
    </div>
  );
};

const HomeView = ({ events, onEnroll, onEventClick }) => {
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesCourse = filterCourse === 'Todos' || event.courses.includes(filterCourse) || event.courses.includes('Geral');
    const matchesDate = !filterDate || event.date === filterDate;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesDate && matchesSearch;
  });

  return (
    <div className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Explorar Eventos</h1>
        <p className="text-slate-400 text-lg">Encontre atividades para completar suas horas complementares.</p>
      </section>

      <section className="sticky top-0 md:top-20 z-30 bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input 
              type="text" placeholder="Buscar eventos, workshops, palestras..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${showFilters ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'}`}
          >
            <Filter size={20} /> <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Curso</label>
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Data</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" style={{ colorScheme: 'dark' }} />
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Flame className="text-amber-500" size={24} /> Em Destaque</h2>
        </div>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => <EventCard key={event.id} event={event} onEnroll={onEnroll} onClick={onEventClick} />)}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed">
            <Search className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum evento encontrado</h3>
            <p className="text-slate-400">Tente ajustar seus filtros de busca para encontrar mais opções.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const ProfileView = ({ user, events, suggestions, onAddSuggestion, onEventClick, onLogout, setUser }) => {
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

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
    <div className="pb-24 pt-6 px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
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
          <p className="text-slate-400 text-sm">{user.semester} • Matrícula: 2023001</p>
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
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] relative" style={{ width: `${(user.hoursCompleted / user.totalHoursNeeded) * 100}%` }}>
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12"></div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-3 font-medium">Faltam <strong className="text-white">{user.totalHoursNeeded - user.hoursCompleted} horas</strong> para concluir o requisito.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-6">
          <button onClick={() => setShowSuggestionModal(true)} className="bg-slate-900/80 hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group flex items-center gap-4 text-left shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0"><Lightbulb size={24} /></div>
            <div><h3 className="text-white font-bold text-sm sm:text-base mb-0.5">Sugerir Evento</h3><p className="text-slate-400 text-xs line-clamp-2">Conhece um evento legal? Envie sua ideia.</p></div>
          </button>
          <button onClick={() => setShowCertificateModal(true)} className="bg-slate-900/80 hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group flex items-center gap-4 text-left shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0"><UploadCloud size={24} /></div>
            <div><h3 className="text-white font-bold text-sm sm:text-base mb-0.5">Enviar Certificado</h3><p className="text-slate-400 text-xs line-clamp-2">Valide horas extras de eventos externos.</p></div>
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
                <div key={event.id} onClick={() => onEventClick(event)} className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-sm transition-all cursor-pointer group relative overflow-hidden ${isApproaching ? 'bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10' : 'bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20'}`}>
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
                </div>
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
              <div key={sug.id} className="bg-slate-900/50 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
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
              </div>
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
              <div key={event.id} onClick={() => onEventClick(event)} className="bg-slate-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all cursor-pointer group">
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
              </div>
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
      
      {showSuggestionModal && <SuggestionModal onClose={() => setShowSuggestionModal(false)} onSubmitIdea={(idea) => {
        onAddSuggestion(idea);
        setShowSuggestionModal(false);
      }} />}
      {showCertificateModal && <CertificateModal onClose={() => setShowCertificateModal(false)} />}
    </div>
  );
};

const EventFormModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState(event || {
    title: '', category: 'Palestras', date: '', time: '', location: '', hours: 2, spots: 50, speaker: '', description: '', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', courses: ["Geral"]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      hours: Number(formData.hours),
      spots: Number(formData.spots)
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400"><CalendarPlus size={20} /></div>
              <h2 className="text-xl font-bold text-white">{event?.id ? 'Editar Evento' : 'Novo Evento'}</h2>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {formData.suggestedBy && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
               <Lightbulb className="text-amber-400 flex-shrink-0" size={20}/>
               <div>
                  <p className="text-sm font-bold text-amber-400">Criando evento a partir de sugestão</p>
                  <p className="text-xs text-slate-300">Este evento exibirá publicamente que foi sugerido por: <strong className="text-white">{formData.suggestedBy}</strong></p>
               </div>
            </div>
          )}
          <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Título do Evento</label>
              <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:ring-1 outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                     {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Palestrante / Responsável</label>
                  <input required name="speaker" value={formData.speaker} onChange={handleChange} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Data</label>
                  <input required name="date" value={formData.date} onChange={handleChange} type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" style={{ colorScheme: 'dark' }} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Horário</label>
                  <input required name="time" value={formData.time} onChange={handleChange} type="text" placeholder="Ex: 14:00 - 16:00" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
               <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Local</label>
                  <input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Vagas</label>
                  <input required name="spots" value={formData.spots} onChange={handleChange} type="number" min="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none resize-none"></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Carga Horária (h)</label>
                  <input required name="hours" value={formData.hours} onChange={handleChange} type="number" min="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Foto / Capa do Evento</label>
                  <label className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors text-slate-400 hover:text-indigo-400">
                     <Camera size={18} /> 
                     <span className="text-sm font-medium truncate max-w-[200px]">{formData.image.startsWith('blob:') ? 'Imagem carregada com sucesso' : 'Fazer upload de foto...'}</span>
                     <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
               </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors font-medium">Cancelar</button>
          <button type="submit" form="event-form" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-sm shadow-indigo-600/20 flex items-center gap-2">
            <Save size={18}/> {event?.id ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

const ProfessorView = ({ activeTab, onLogout, events, setEvents, certs, setCerts, suggestions, setSuggestions }) => {
  const [taskType, setTaskType] = useState('certificados');
  const [sugTab, setSugTab] = useState('pendentes');

  const handleApproveCert = (id) => setCerts(prev => prev.filter(c => c.id !== id));
  const handleRejectCert = (id) => setCerts(prev => prev.filter(c => c.id !== id));
  
  const handleApproveSug = (id) => setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'aprovada' } : s));
  const handleRejectSug = (id) => setSuggestions(prev => prev.filter(s => s.id !== id));

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

  if (activeTab === 'perfil') {
    return (
      <div className="pb-24 pt-6 px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
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
      </div>
    );
  }

  if (activeTab === 'eventos') {
    return (
      <div className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
            {events.map(event => (
              <div key={event.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col group shadow-sm hover:border-slate-700 transition-all">
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
              </div>
            ))}
         </div>
         {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} onSave={handleSaveEvent} />}
      </div>
    );
  }

  if (activeTab === 'tarefas') {
    const pendingSugs = suggestions.filter(s => s.status === 'pendente');
    const approvedSugs = suggestions.filter(s => s.status === 'aprovada');

    return (
      <div className="pb-24 pt-6 px-4 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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

         {taskType === 'certificados' ? (
            <div className="space-y-4">
               {certs.length === 0 ? (
                  <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4"><CheckCircle size={40} /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Caixa de Entrada Limpa!</h3>
                    <p className="text-slate-400">Todos os certificados já foram validados.</p>
                  </div>
               ) : (
                 certs.map(cert => (
                   <div key={cert.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2">
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
                   </div>
                 ))
               )}
            </div>
         ) : (
            <div className="space-y-4">
               <div className="flex gap-4 border-b border-slate-800 pb-2 mb-4 px-2">
                 <button onClick={() => setSugTab('pendentes')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'pendentes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aguardando ({pendingSugs.length})</button>
                 <button onClick={() => setSugTab('aprovadas')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sugTab === 'aprovadas' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Aprovadas ({approvedSugs.length})</button>
               </div>

               {sugTab === 'pendentes' && (
                 pendingSugs.length === 0 ? (
                    <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 border-dashed animate-in fade-in zoom-in">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4"><Inbox size={40} /></div>
                      <h3 className="text-xl font-bold text-white mb-2">Nenhuma sugestão nova</h3>
                      <p className="text-slate-400">As ideias dos alunos aparecerão aqui.</p>
                    </div>
                 ) : (
                   pendingSugs.map(sug => (
                     <div key={sug.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2">
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
                     </div>
                   ))
                 )
               )}

               {sugTab === 'aprovadas' && (
                 approvedSugs.length === 0 ? (
                    <div className="text-center py-8"><p className="text-slate-500">Nenhuma ideia aprovada ainda.</p></div>
                 ) : (
                   approvedSugs.map(sug => (
                     <div key={sug.id} className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 transition-all shadow-sm flex items-center justify-between gap-4 animate-in fade-in">
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
                     </div>
                   ))
                 )
               )}
            </div>
         )}
         {isEventModalOpen && <EventFormModal event={editingEvent} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} onSave={handleSaveEvent} />}
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    </div>
  );
};

const AuthView = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); 
  const [role, setRole] = useState('aluno'); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(role); }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
         <div className="flex justify-center mb-8">
           <div className="flex items-center gap-2">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><Zap className="text-white" size={28} /></div>
             <span className="font-black text-3xl tracking-tight text-white">Flow<span className="text-indigo-500">Up</span></span>
           </div>
         </div>

         <div className="flex p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800/80">
           <button onClick={() => {setRole('aluno'); setMode('login')}} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'aluno' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><GraduationCap size={18} /> Aluno</button>
           <button onClick={() => {setRole('professor'); setMode('login')}} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'professor' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><Briefcase size={18} /> Professor</button>
         </div>

         <div className="flex gap-6 mb-6 border-b border-slate-800/50">
           <button onClick={() => setMode('login')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${mode === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Entrar</button>
           <button onClick={() => setMode('register')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${mode === 'register' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Cadastrar</button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            {mode === 'login' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{role === 'aluno' ? 'Matrícula' : 'Matrícula / SIAPE'}</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input required type="number" placeholder={role === 'aluno' ? "Sua matrícula" : "Matrícula do professor"} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input required type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{role === 'aluno' ? 'Matrícula' : 'Matrícula / SIAPE'}</label>
                  <div className="relative group">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input required type="number" placeholder="Digite sua matrícula" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input required type="text" placeholder="Como devemos chamar você?" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-600" />
                  </div>
                </div>
                {role === 'aluno' && (
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Curso</label>
                        <select required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none text-sm">
                           <option value="" disabled>Selecione</option>
                           <option value="Engenharia de Software">Engenharia de Software</option>
                           <option value="Engenharia Civil">Engenharia Civil</option>
                           <option value="Ciência da Computação">Ciência da Computação</option>
                           <option value="Design">Design</option>
                        </select>
                      </div>
                      <div className="w-[100px]">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Período</label>
                        <select required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none text-sm">
                           <option value="" disabled>-</option>
                           {[1,2,3,4,5,6,7,8,9,10].map(p => <option key={p} value={p}>{p}º</option>)}
                        </select>
                      </div>
                   </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input required type="password" placeholder="Crie uma senha forte" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-600" />
                  </div>
                </div>
              </>
            )}
            <button type="submit" disabled={isLoading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Entrar na plataforma' : 'Criar minha conta')}
            </button>
         </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('aluno');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(MOCK_USER);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [pendingCerts, setPendingCerts] = useState(INITIAL_CERTS);

  const handleAddSuggestion = (idea) => {
    const newSug = {
      id: Date.now(), student: user.name, avatar: user.avatar, course: user.course,
      title: idea.title, description: idea.description, date: getRelativeDate(0), status: 'pendente'
    };
    setSuggestions([newSug, ...suggestions]);
  };

  const handleEnroll = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const isEnrolling = !event.isEnrolled;
        const isPast = getDaysDifference(event.date) < 0;
        
        if (isPast) {
          if (isEnrolling) setUser(prev => ({...prev, hoursCompleted: prev.hoursCompleted + event.hours}));
          else setUser(prev => ({...prev, hoursCompleted: prev.hoursCompleted - event.hours}));
        }

        return { ...event, isEnrolled: isEnrolling, enrolled: isEnrolling ? event.enrolled + 1 : event.enrolled - 1 };
      }
      return event;
    }));
    
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({
        ...prev, isEnrolled: !prev.isEnrolled, enrolled: !prev.isEnrolled ? prev.enrolled + 1 : prev.enrolled - 1
      }));
    }
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab(role === 'professor' ? 'painel' : 'home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('aluno');
    setActiveTab('home');
  };

  if (!isAuthenticated) return <AuthView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200">
      <header className="hidden md:flex sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><Zap className="text-white" size={24} /></div>
          <span className="font-black text-xl tracking-tight text-white">Flow<span className="text-indigo-500">Up</span></span>
        </div>
        
        <nav className="flex items-center gap-8 bg-slate-900 px-6 py-2 rounded-full border border-slate-800 shadow-inner">
          {userRole === 'aluno' ? (
            <>
              <button onClick={() => setActiveTab('home')} className={`font-semibold text-sm transition-colors ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Explorar</button>
              <button onClick={() => setActiveTab('profile')} className={`font-semibold text-sm transition-colors ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Meu Perfil</button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('painel')} className={`font-semibold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'painel' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}><LayoutDashboard size={16}/> Painel</button>
              <button onClick={() => setActiveTab('eventos')} className={`font-semibold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'eventos' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}><CalendarDays size={16}/> Eventos</button>
              <button onClick={() => setActiveTab('tarefas')} className={`font-semibold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'tarefas' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}><CheckSquare size={16}/> Tarefas</button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
          </button>
          <div onClick={() => setActiveTab('perfil')} className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-colors ${userRole === 'professor' ? 'border-amber-500 hover:border-amber-400' : 'border-slate-700 hover:border-indigo-500'}`}>
             <img src={userRole === 'aluno' ? user.avatar : MOCK_PROF.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="w-full">
        {userRole === 'aluno' ? (
          activeTab === 'home' ? (
            <HomeView events={events} onEnroll={handleEnroll} onEventClick={setSelectedEvent} />
          ) : (
            <ProfileView user={user} setUser={setUser} events={events} suggestions={suggestions} onAddSuggestion={handleAddSuggestion} onEventClick={setSelectedEvent} onLogout={handleLogout} />
          )
        ) : (
          <ProfessorView activeTab={activeTab} onLogout={handleLogout} events={events} setEvents={setEvents} certs={pendingCerts} setCerts={setPendingCerts} suggestions={suggestions} setSuggestions={setSuggestions} />
        )}
      </main>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onEnroll={handleEnroll} />}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 pb-safe z-40">
        <div className="flex justify-around items-center h-16 px-2 sm:px-6">
          {userRole === 'aluno' ? (
            <>
              <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'home' && <div className="absolute top-0 w-8 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                <Home size={22} className={activeTab === 'home' ? 'fill-indigo-900/50' : ''} />
                <span className="text-[10px] font-bold">Início</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'profile' && <div className="absolute top-0 w-8 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                <User size={22} className={activeTab === 'profile' ? 'fill-indigo-900/50' : ''} />
                <span className="text-[10px] font-bold">Perfil</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('painel')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'painel' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'painel' && <div className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                <LayoutDashboard size={22} className={activeTab === 'painel' ? 'fill-amber-900/50' : ''} />
                <span className="text-[10px] font-bold">Painel</span>
              </button>
              <button onClick={() => setActiveTab('eventos')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'eventos' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'eventos' && <div className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                <CalendarDays size={22} className={activeTab === 'eventos' ? 'fill-amber-900/50' : ''} />
                <span className="text-[10px] font-bold">Eventos</span>
              </button>
              <button onClick={() => setActiveTab('tarefas')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'tarefas' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'tarefas' && <div className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                <CheckSquare size={22} className={activeTab === 'tarefas' ? 'fill-amber-900/50' : ''} />
                <span className="text-[10px] font-bold">Tarefas</span>
              </button>
              <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${activeTab === 'perfil' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {activeTab === 'perfil' && <div className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                <User size={22} className={activeTab === 'perfil' ? 'fill-amber-900/50' : ''} />
                <span className="text-[10px] font-bold">Perfil</span>
              </button>
            </>
          )}
        </div>
      </nav>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}} />
    </div>
  );
}