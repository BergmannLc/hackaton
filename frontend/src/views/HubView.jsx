import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Clock, Award, ExternalLink, UploadCloud, X, CheckCircle,
  Sparkles, Star, GraduationCap, Code2, Heart, Rocket, Send, Loader2, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Badge } from '../components/Badge';
import {
  HUB_PARTNERS,
  HUB_COURSES,
  HUB_TRAILS,
  HUB_CATEGORIES,
  HUB_LEVELS,
} from '../services/mocks';

// Mapeia partnerId -> objeto parceiro (para lookup rápido)
const PARTNERS_BY_ID = HUB_PARTNERS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

// Paleta de cores aplicada a partners e trilhas (Tailwind safelist friendly).
const ACCENT_CLASSES = {
  indigo:  { bg: 'bg-indigo-500/20',  text: 'text-indigo-300',  border: 'border-indigo-500/30',  ring: 'ring-indigo-500/40' },
  fuchsia: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30', ring: 'ring-fuchsia-500/40' },
  amber:   { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/30',   ring: 'ring-amber-500/40' },
  sky:     { bg: 'bg-sky-500/20',     text: 'text-sky-300',     border: 'border-sky-500/30',     ring: 'ring-sky-500/40' },
  rose:    { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/30',    ring: 'ring-rose-500/40' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', ring: 'ring-emerald-500/40' },
  red:     { bg: 'bg-red-500/20',     text: 'text-red-300',     border: 'border-red-500/30',     ring: 'ring-red-500/40' },
  teal:    { bg: 'bg-teal-500/20',    text: 'text-teal-300',    border: 'border-teal-500/30',    ring: 'ring-teal-500/40' },
  orange:  { bg: 'bg-orange-500/20',  text: 'text-orange-300',  border: 'border-orange-500/30',  ring: 'ring-orange-500/40' },
  violet:  { bg: 'bg-violet-500/20',  text: 'text-violet-300',  border: 'border-violet-500/30',  ring: 'ring-violet-500/40' },
};

const TRAIL_ICONS = { Code2, Heart, Rocket, Sparkles };

// =================================================================
// Modal de validação de horas (envio de certificado)
// =================================================================
const ValidateHoursModal = ({ course, onClose }) => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      toast.success(`Certificado de "${course.title}" enviado para análise.`);
      setTimeout(onClose, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-slate-900 rounded-3xl w-full max-w-md border border-slate-800 shadow-2xl p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Validar Horas</h3>
              <p className="text-xs text-slate-400">{course.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-white font-bold text-lg mb-1">Enviado!</h4>
            <p className="text-slate-400 text-sm">A coordenação vai validar suas {course.hours} horas em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 space-y-1">
              <p><span className="text-slate-500">Curso:</span> <strong className="text-white">{course.title}</strong></p>
              <p><span className="text-slate-500">Parceiro:</span> {PARTNERS_BY_ID[course.partnerId]?.name}</p>
              <p><span className="text-slate-500">Horas:</span> <strong className="text-emerald-400">{course.hours}h</strong></p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Certificado emitido pelo parceiro</label>
              <label className="w-full bg-slate-950 border border-slate-800 border-dashed hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-indigo-400 group">
                <UploadCloud size={28} className="mb-2 text-slate-500 group-hover:text-indigo-400" />
                <span className="text-sm font-medium">Anexar arquivo (PDF ou imagem)</span>
                <input required type="file" className="hidden" accept=".pdf,image/*" />
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'sending'
                ? <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                : <><Send size={18} /> Enviar para Validação</>
              }
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// =================================================================
// Avatar do parceiro (sem imagem externa — só iniciais + cor)
// =================================================================
const PartnerBadge = ({ partner, size = 'sm' }) => {
  if (!partner) return null;
  const c = ACCENT_CLASSES[partner.accent] || ACCENT_CLASSES.indigo;
  const sizeClasses = size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-xs';
  return (
    <div className={`flex items-center gap-2`}>
      <div className={`${sizeClasses} ${c.bg} ${c.text} ${c.border} border rounded-xl flex items-center justify-center font-black tracking-tight`}>
        {partner.initials}
      </div>
      <span className="text-xs font-bold text-slate-300">{partner.name}</span>
    </div>
  );
};

// =================================================================
// Card de curso individual
// =================================================================
const CourseCard = ({ course, onStart, onValidate }) => {
  const partner = PARTNERS_BY_ID[course.partnerId];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl shadow-sm border bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 overflow-hidden transition-all duration-300 flex flex-col group"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant="primary" className="shadow-sm">{course.category}</Badge>
          {course.isRecommended && (
            <Badge variant="warning" className="shadow-sm flex items-center gap-1">
              <Star size={12} /> Recomendado
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <div className="bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Award size={14} className="text-emerald-400" /> {course.hours}h
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white leading-tight mb-3 group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>

        <div className="mb-3">
          <PartnerBadge partner={partner} />
        </div>

        <div className="space-y-1.5 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2"><Clock size={14} className="text-slate-500" /> {course.format}</div>
          <div className="flex items-center gap-2"><GraduationCap size={14} className="text-slate-500" /> {course.level}</div>
          <div className="flex items-center gap-2"><Sparkles size={14} className="text-slate-500" /> {course.price}</div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{course.description}</p>

        <div className="mt-auto">
          <p className="text-[11px] text-slate-500 mb-3">
            <strong className="text-slate-300">{course.enrollments}</strong> alunos da faculdade já fizeram
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onStart(course)}
              className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={14} /> Começar
            </button>
            <button
              onClick={() => onValidate(course)}
              className="px-3 py-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
              title="Já completei este curso"
            >
              <Award size={14} /> Validar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =================================================================
// Card de Trilha (destaque visual)
// =================================================================
const TrailCard = ({ trail, onOpen }) => {
  const c = ACCENT_CLASSES[trail.accent] || ACCENT_CLASSES.indigo;
  const Icon = TRAIL_ICONS[trail.icon] || Sparkles;
  const courseCount = trail.courseIds.length;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      onClick={() => onOpen(trail)}
      className={`relative rounded-3xl border ${c.border} ${c.bg} p-6 cursor-pointer overflow-hidden group min-h-[200px] flex flex-col justify-between`}
    >
      <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${c.bg} opacity-40 blur-3xl pointer-events-none`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.text} ${c.border} border flex items-center justify-center`}>
            <Icon size={24} />
          </div>
          <Badge variant="neutral" className="bg-slate-900/60 backdrop-blur-md">
            Trilha FlowUp
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight mb-1">{trail.title}</h3>
        <p className={`text-sm ${c.text} mb-3`}>{trail.subtitle}</p>
        <p className="text-xs text-slate-400 line-clamp-2">{trail.description}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
        <div className="text-xs text-slate-400">
          <strong className="text-white">{courseCount}</strong> cursos • <strong className="text-emerald-400">{trail.totalHours}h</strong>
        </div>
        <span className={`text-xs font-bold ${c.text} group-hover:underline`}>Ver trilha →</span>
      </div>
    </motion.div>
  );
};

// =================================================================
// Modal de detalhes da trilha
// =================================================================
const TrailDetailModal = ({ trail, onClose, onStart, onValidate }) => {
  if (!trail) return null;
  const c = ACCENT_CLASSES[trail.accent] || ACCENT_CLASSES.indigo;
  const Icon = TRAIL_ICONS[trail.icon] || Sparkles;
  const courses = trail.courseIds.map((id) => HUB_COURSES.find((co) => co.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className={`p-6 border-b border-slate-800 ${c.bg} relative overflow-hidden`}>
          <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${c.bg} opacity-50 blur-3xl pointer-events-none`}></div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-900/60 text-slate-400 hover:text-white rounded-full"><X size={18} /></button>

          <div className="relative z-10 flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.text} ${c.border} border flex items-center justify-center flex-shrink-0`}>
              <Icon size={28} />
            </div>
            <div>
              <Badge variant="neutral" className="bg-slate-900/60 backdrop-blur-md mb-2">Trilha FlowUp</Badge>
              <h2 className="text-2xl font-bold text-white leading-tight">{trail.title}</h2>
              <p className={`text-sm ${c.text} mt-1`}>{trail.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-slate-300 text-sm">{trail.description}</p>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex justify-around text-center">
            <div>
              <div className="text-2xl font-black text-white">{courses.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cursos</div>
            </div>
            <div className="border-l border-slate-800"></div>
            <div>
              <div className="text-2xl font-black text-emerald-400">{trail.totalHours}h</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Carga total</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Ordem sugerida</h4>
            <div className="space-y-3">
              {courses.map((course, idx) => {
                const partner = PARTNERS_BY_ID[course.partnerId];
                return (
                  <div key={course.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} ${c.border} border flex items-center justify-center font-black flex-shrink-0`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-bold text-sm leading-tight truncate">{course.title}</h5>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{partner?.name}</span>
                        <span>•</span>
                        <span>{course.hours}h</span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => onStart(course)} className="px-3 py-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center gap-1">
                        <ExternalLink size={12} />
                      </button>
                      <button onClick={() => onValidate(course)} className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-lg transition-all flex items-center gap-1">
                        <Award size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// =================================================================
// HubView principal
// =================================================================
export const HubView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterPartner, setFilterPartner] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedTrail, setSelectedTrail] = useState(null);
  const [validatingCourse, setValidatingCourse] = useState(null);

  const handleStartCourse = (course) => {
    toast(`Abrindo ${course.title} no ${PARTNERS_BY_ID[course.partnerId]?.name}...`, { icon: '🚀' });
    // Em produção: window.open(course.link, '_blank')
  };

  const filteredCourses = useMemo(() => {
    return HUB_COURSES.filter((c) => {
      const matchesCategory = filterCategory === 'Todos' || c.category === filterCategory;
      const matchesLevel    = filterLevel    === 'Todos' || c.level    === filterLevel;
      const matchesPartner  = filterPartner  === 'Todos' || c.partnerId === filterPartner;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q
        || c.title.toLowerCase().includes(q)
        || c.description.toLowerCase().includes(q)
        || c.category.toLowerCase().includes(q);
      return matchesCategory && matchesLevel && matchesPartner && matchesSearch;
    });
  }, [filterCategory, filterLevel, filterPartner, searchQuery]);

  const featuredCourse = HUB_COURSES.find((c) => c.isFeatured);
  const featuredPartner = featuredCourse ? PARTNERS_BY_ID[featuredCourse.partnerId] : null;
  const featuredAccent = featuredPartner ? (ACCENT_CLASSES[featuredPartner.accent] || ACCENT_CLASSES.indigo) : ACCENT_CLASSES.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pb-24 pt-4 sm:pt-6 px-4 max-w-7xl mx-auto space-y-10"
    >
      {/* ============ HERO: curso em destaque ============ */}
      {featuredCourse && (
        <section
          className="relative w-full rounded-[2rem] overflow-hidden border border-slate-800/60 shadow-2xl shadow-indigo-900/20 group cursor-pointer"
          onClick={() => handleStartCourse(featuredCourse)}
        >
          <div className="absolute inset-0 bg-slate-900">
            <img src={featuredCourse.image} alt={featuredCourse.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className={`absolute inset-0 bg-gradient-to-r ${featuredAccent.bg} via-transparent to-transparent opacity-50`}></div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end min-h-[300px] sm:min-h-[360px]">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="primary" className={`${featuredAccent.bg} ${featuredAccent.text} ${featuredAccent.border} backdrop-blur-md`}>
                Em Destaque
              </Badge>
              <Badge variant="warning" className="animate-pulse"><Flame size={14} className="inline mr-1" /> Mais procurado</Badge>
              <Badge variant="success" className="backdrop-blur-md">{featuredCourse.price}</Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3 group-hover:text-indigo-200 transition-colors">
              {featuredCourse.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl line-clamp-2 mb-5">{featuredCourse.description}</p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-slate-300 font-medium mb-6">
              <PartnerBadge partner={featuredPartner} size="lg" />
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-400" /> {featuredCourse.hours}h</span>
              <span className="flex items-center gap-1.5"><GraduationCap size={16} className="text-indigo-400" /> {featuredCourse.level}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={(e) => { e.stopPropagation(); handleStartCourse(featuredCourse); }}
                className="px-8 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} /> Começar agora
              </button>
              <span className="text-slate-400 text-sm font-medium">
                <strong className="text-white">{featuredCourse.enrollments}</strong> alunos já fizeram este curso
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ============ TRILHAS FlowUp ============ */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={24} /> Trilhas FlowUp
            </h2>
            <p className="text-sm text-slate-400 mt-1">Sequências curadas de cursos para construir habilidades completas.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {HUB_TRAILS.map((trail) => (
            <TrailCard key={trail.id} trail={trail} onOpen={setSelectedTrail} />
          ))}
        </div>
      </section>

      {/* ============ Busca + filtros ============ */}
      <section className="sticky top-[72px] md:top-[88px] z-30 bg-slate-950/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar cursos do Hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${showFilters ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'}`}
          >
            <Filter size={20} /> <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* Pílulas de categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {HUB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${filterCategory === cat ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
            >
              {cat}
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
                <label className="block text-sm font-medium text-slate-400 mb-2">Nível</label>
                <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                  {HUB_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Parceiro</label>
                <select value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                  <option value="Todos">Todos os parceiros</option>
                  {HUB_PARTNERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ============ Grid de cursos ============ */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-indigo-400" size={24} />
            {filterCategory === 'Todos' ? 'Todos os Cursos' : `Cursos em ${filterCategory}`}
          </h2>
          <span className="text-sm text-slate-400">
            <strong className="text-white">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'curso' : 'cursos'}
          </span>
        </div>

        {filteredCourses.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onStart={handleStartCourse}
                  onValidate={setValidatingCourse}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-slate-900/50 rounded-[2rem] p-12 text-center border border-slate-800/80 border-dashed flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-6"><Search size={32} /></div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">Tente outra combinação de filtros, ou limpe a busca pra ver todos os cursos do Hub.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('Todos'); setFilterLevel('Todos'); setFilterPartner('Todos'); }}
              className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl transition-all font-bold"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        )}
      </section>

      {/* ============ Parceiros do Hub (vitrine) ============ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="text-amber-400" size={24} /> Parceiros FlowUp
          </h2>
          <p className="text-sm text-slate-400 mt-1">Instituições que patrocinam cursos gratuitos para nossos alunos.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {HUB_PARTNERS.map((partner) => {
            const c = ACCENT_CLASSES[partner.accent] || ACCENT_CLASSES.indigo;
            const courseCount = HUB_COURSES.filter((co) => co.partnerId === partner.id).length;
            return (
              <button
                key={partner.id}
                onClick={() => setFilterPartner(partner.id)}
                className={`bg-slate-900 hover:${c.bg.replace('/20','/10')} border border-slate-800 hover:${c.border} rounded-2xl p-4 transition-all text-left group`}
                title={partner.description}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} ${c.border} border flex items-center justify-center font-black text-base mb-3`}>
                  {partner.initials}
                </div>
                <h4 className="text-white font-bold text-sm leading-tight truncate">{partner.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{courseCount} {courseCount === 1 ? 'curso' : 'cursos'}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ Modais ============ */}
      <AnimatePresence>
        {selectedTrail && (
          <TrailDetailModal
            trail={selectedTrail}
            onClose={() => setSelectedTrail(null)}
            onStart={(course) => { setSelectedTrail(null); handleStartCourse(course); }}
            onValidate={(course) => { setSelectedTrail(null); setValidatingCourse(course); }}
          />
        )}
        {validatingCourse && (
          <ValidateHoursModal
            course={validatingCourse}
            onClose={() => setValidatingCourse(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HubView;
