import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, QrCode, Users, CheckCircle, Circle, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export const AttendanceProfModal = ({ event, onClose, onUpdateEvent }) => {
  const [activeTab, setActiveTab] = useState('qr');
  
  // Lista fictícia de inscritos caso não haja dados reais no mock
  const [enrolledStudents, setEnrolledStudents] = useState(event.enrolledStudents || [
    { id: 1, name: 'Lucas Silva', matricula: '2023001', isPresent: event.presentStudents?.includes(1) },
    { id: 2, name: 'Mariana Costa', matricula: '2023002', isPresent: event.presentStudents?.includes(2) },
    { id: 3, name: 'João Pedro', matricula: '2023003', isPresent: event.presentStudents?.includes(3) },
    { id: 4, name: 'Ana Beatriz', matricula: '2023004', isPresent: event.presentStudents?.includes(4) }
  ]);

  const qrValue = JSON.stringify({ eventId: event.id, secret: 'flowup-hackathon-2024' });

  const togglePresence = (studentId) => {
    const newStudentsList = enrolledStudents.map(s => 
      s.id === studentId ? { ...s, isPresent: !s.isPresent } : s
    );
    setEnrolledStudents(newStudentsList);
    
    // Atualizar no componente pai
    const presentIds = newStudentsList.filter(s => s.isPresent).map(s => s.id);
    onUpdateEvent({ ...event, presentStudents: presentIds });
    toast.success('Lista atualizada com sucesso!');
  };

  const handleEndEvent = () => {
    // 1. Gerar arquivo CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nome,Matrícula,Status\n";
    enrolledStudents.forEach(student => {
       const status = student.isPresent ? "Presente" : "Ausente";
       csvContent += `${student.name},${student.matricula},${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lista_presenca_${event.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Encerrar evento (mudar data para ontem para ele ficar como "Concluído")
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDateStr = yesterday.toISOString().split('T')[0];
    
    // Atualiza a data e garante que a lista final está salva
    const presentIds = enrolledStudents.filter(s => s.isPresent).map(s => s.id);
    onUpdateEvent({ ...event, date: pastDateStr, presentStudents: presentIds });
    
    toast.success('Evento encerrado e lista baixada!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-slate-900 w-full max-w-2xl rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><QrCode className="text-indigo-400"/> Gerenciar Presença</h2>
            <p className="text-slate-400 text-sm mt-1">{event.title}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-950">
          <button onClick={() => setActiveTab('qr')} className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'qr' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
             <QrCode size={18}/> Exibir QR Code
          </button>
          <button onClick={() => setActiveTab('manual')} className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
             <Users size={18}/> Chamada Manual
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center">
          {activeTab === 'qr' ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center w-full max-w-sm mx-auto">
               <p className="text-slate-300 mb-8">Projete este QR Code para que os alunos possam ler e registrar presença automaticamente através do app FlowUp.</p>
               <div className="bg-white p-6 rounded-3xl inline-block shadow-xl shadow-indigo-500/10 border-4 border-indigo-50/10">
                  <QRCodeSVG value={qrValue} size={256} level="H" includeMargin={false} fgColor="#0f172a" />
               </div>
               <p className="text-indigo-400 font-bold mt-8 text-lg animate-pulse">Aguardando leituras...</p>
            </motion.div>
          ) : (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full">
               <div className="space-y-3">
                 {enrolledStudents.map(student => (
                   <div key={student.id} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors">
                     <div>
                       <p className="text-white font-bold text-lg">{student.name}</p>
                       <p className="text-slate-500 text-sm">Matrícula: {student.matricula}</p>
                     </div>
                     <button onClick={() => togglePresence(student.id)} className="focus:outline-none transition-transform group-hover:scale-105">
                       {student.isPresent ? (
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl font-bold border border-emerald-500/20"><CheckCircle size={20}/> Presente</div>
                       ) : (
                          <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 bg-slate-800 px-4 py-2 rounded-xl font-bold border border-slate-700 hover:border-indigo-500/50 transition-colors"><Circle size={20}/> Ausente</div>
                       )}
                     </button>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button onClick={handleEndEvent} className="w-full sm:w-auto bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
            <Download size={18} />
            Encerrar Evento e Baixar Lista
          </button>
        </div>
      </motion.div>
    </div>
  );
};
