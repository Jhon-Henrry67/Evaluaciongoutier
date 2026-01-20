
import React from 'react';
import { Evaluation } from '../types';

interface StatsOverviewProps {
  evaluations: Evaluation[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ evaluations }) => {
  const total = evaluations.length;
  
  const calculateAverage = () => {
    if (total === 0) return '0.0';
    let sum = 0;
    let count = 0;
    evaluations.forEach(ev => {
      Object.values(ev.ratings).forEach(cat => {
        Object.values(cat).forEach(val => {
          if (val) {
            sum += parseInt(val);
            count++;
          }
        });
      });
    });
    return count > 0 ? (sum / count).toFixed(1) : '0.0';
  };

  const stats = [
    { label: 'Total Evaluaciones', value: total, icon: 'fa-clipboard-check', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Promedio Global', value: calculateAverage(), icon: 'fa-star', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Residentes Activos', value: new Set(evaluations.map(e => `${e.firstName} ${e.lastName}`)).size, icon: 'fa-user-md', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-xl`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
