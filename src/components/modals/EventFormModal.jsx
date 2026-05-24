import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { CATEGORIES, COURSES } from '../../services/mocks';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const EventFormModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState(event || {
    title: '', category: 'Palestras', date: '', time: '', location: '', hours: 2, spots: 50, speaker: '', description: '', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', courses: ["Geral"]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseToggle = (course) => {
    setFormData(prev => {
      const courses = prev.courses.includes(course) ? prev.courses.filter(c => c !== course) : [...prev.courses, course];
      return { ...prev, courses: courses.length ? courses : ["Geral"] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    toast.success(event ? "Evento atualizado!" : "Novo evento criado!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 border border-slate-800"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{event ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2">
                 <label className="block text-sm text-slate-400 mb-1">Título</label>
                 <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Categoria</label>
                 <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500">
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Palestrante</label>
                 <input required type="text" name="speaker" value={formData.speaker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Data</label>
                 <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" style={{ colorScheme: 'dark' }} />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Horário (ex: 14:00 - 16:00)</label>
                 <input required type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Local</label>
                 <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm text-slate-400 mb-1">Vagas</label>
                   <input required type="number" min="1" name="spots" value={formData.spots} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm text-slate-400 mb-1">Horas</label>
                   <input required type="number" min="1" name="hours" value={formData.hours} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
                 </div>
               </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm text-slate-400 mb-1">URL da Imagem de Capa</label>
                 <input required type="url" name="image" value={formData.image} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500" />
               </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm text-slate-400 mb-2">Cursos Recomendados</label>
                 <div className="flex flex-wrap gap-2">
                   {COURSES.filter(c => c !== 'Todos').map(course => (
                     <button type="button" key={course} onClick={() => handleCourseToggle(course)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${formData.courses.includes(course) ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        {course}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                 <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none" />
               </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-3xl flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
           <button type="submit" form="event-form" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm flex items-center gap-2"><Save size={18}/> Salvar Evento</button>
        </div>
      </motion.div>
    </div>
  );
};
