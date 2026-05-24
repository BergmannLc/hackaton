import React, { useState } from 'react';
import { Zap, GraduationCap, Briefcase, Hash, Lock, User, Loader2 } from 'lucide-react';
import { login } from '../services/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logoFlowUp from '../assets/logoFlowUp.png';

export const AuthView = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('aluno');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = role === 'professor' ? 'admin@flowup.com' : 'aluno@flowup.com';
      const response = await login(email, 'fake_password');
      toast.success(`Bem-vindo de volta, ${response.data.user.name.split(' ')[0]}!`);
      onLogin(response.data.user);
    } catch (err) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <img src={logoFlowUp} alt="FlowUp Logo" className="h-40 md:h-48 w-auto object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          </div>
        </div>

        <div className="flex p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800/80">
          <button onClick={() => { setRole('aluno'); setMode('login') }} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'aluno' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><GraduationCap size={18} /> Aluno</button>
          <button onClick={() => { setRole('professor'); setMode('login') }} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'professor' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><Briefcase size={18} /> Professor</button>
        </div>

        <div className="flex gap-6 mb-6 border-b border-slate-800/50">
          <button onClick={() => setMode('login')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${mode === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Entrar</button>
          <button onClick={() => setMode('register')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${mode === 'register' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Cadastrar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'login' ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{role === 'aluno' ? 'Matrícula' : 'Matrícula / SIAPE'}</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input required type="text" placeholder={role === 'aluno' ? "Sua matrícula" : "Matrícula do professor"} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{role === 'aluno' ? 'Matrícula' : 'Matrícula / SIAPE'}</label>
                <div className="relative group">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input required type="text" placeholder="Digite sua matrícula" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-600" />
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
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => <option key={p} value={p}>{p}º</option>)}
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
            </motion.div>
          )}
          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Entrar na plataforma' : 'Criar minha conta')}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
