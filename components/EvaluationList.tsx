
import React from 'react';
import { Evaluation } from '../types';

interface EvaluationListProps {
  evaluations: Evaluation[];
  onEdit: (ev: Evaluation) => void;
  onView: (ev: Evaluation) => void;
}

const EvaluationList: React.FC<EvaluationListProps> = ({ evaluations, onEdit, onView }) => {
  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600'
    ];
    return gradients[name.length % gradients.length];
  };

  if (evaluations.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-slate-100 rounded-[3rem] shadow-inner">
        <i className="fas fa-folder-open text-slate-200 text-6xl mb-4"></i>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay registros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {evaluations.map(ev => (
        <div 
          key={ev.id} 
          className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-blue-100 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(ev.firstName + ev.lastName)} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
              {ev.firstName[0]}{ev.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {ev.firstName} {ev.lastName}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[9px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase tracking-widest">{ev.academicYear}</span>
                <span className="text-[9px] font-black px-2 py-1 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">{ev.trimester}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 relative z-10">
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-2">
              <i className="fas fa-calendar-alt"></i> {new Date(ev.date).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => onView(ev)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-expand-alt"></i>
              </button>
              <button 
                onClick={() => onEdit(ev)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluationList;
