
import React from 'react';
import { Evaluation } from '../types';

interface EvaluationListProps {
  evaluations: Evaluation[];
  onEdit: (ev: Evaluation) => void;
  onView: (ev: Evaluation) => void;
}

const EvaluationList: React.FC<EvaluationListProps> = ({ evaluations, onEdit, onView }) => {
  if (evaluations.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-search text-3xl text-slate-300"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No se encontraron evaluaciones</h3>
        <p className="text-slate-500 mt-2">Intenta ajustar tus criterios de búsqueda o agrega una nueva.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {evaluations.map((ev) => (
        <div 
          key={ev.id} 
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-100">
                {ev.firstName[0]}{ev.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {ev.firstName} {ev.lastName}
                </h3>
                <div className="flex flex-wrap gap-y-1 gap-x-4 mt-1">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <i className="fas fa-graduation-cap text-blue-400"></i> {ev.academicYear}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <i className="fas fa-calendar-alt text-blue-400"></i> {ev.trimester}
                  </span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <i className="fas fa-clock"></i> {new Date(ev.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
            <button 
              type="button"
              onClick={() => onView(ev)}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Ver detalles"
            >
              <i className="fas fa-eye text-lg"></i>
            </button>
            <button 
              type="button"
              onClick={() => onEdit(ev)}
              className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
              title="Editar"
            >
              <i className="fas fa-edit text-lg"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluationList;
