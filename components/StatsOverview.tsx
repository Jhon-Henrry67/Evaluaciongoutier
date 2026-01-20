
import React from 'react';
import { Evaluation } from '../types';

interface StatsOverviewProps {
  evaluations: Evaluation[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ evaluations }) => {
  const calculateAverage = () => {
    if (evaluations.length === 0) return '0.0';
    let sum = 0, count = 0;
    evaluations.forEach(ev => {
      Object.values(ev.ratings).forEach(cat => {
        Object.values(cat).forEach(val => {
          if (val) { sum += parseInt(val); count++; }
        });
      });
    });
    return count > 0 ? (sum / count).toFixed(1) : '0.0';
  };

  const avg = parseFloat(calculateAverage());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="fas fa-clipboard-list text-white"></i>
          </div>
        </div>
        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Evaluaciones</p>
        <p className="text-4xl font-black mt-1">{evaluations.length}</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${avg >= 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <i className="fas fa-star"></i>
          </div>
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${avg >= 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {avg >= 3 ? 'EXCELENTE' : 'EN PROGRESO'}
          </span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Promedio Global</p>
        <p className="text-4xl font-black text-slate-900 mt-1">{calculateAverage()}</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-user-md"></i>
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Residentes</p>
        <p className="text-4xl font-black text-slate-900 mt-1">
          {new Set(evaluations.map(e => `${e.firstName} ${e.lastName}`)).size}
        </p>
      </div>
    </div>
  );
};

export default StatsOverview;
