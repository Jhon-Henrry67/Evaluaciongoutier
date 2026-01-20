
import React, { useState } from 'react';
import { Evaluation, RatingValue, EvaluationRatings } from '../types';
import { ACADEMIC_YEARS, TRIMESTERS, EVALUATION_STRUCTURE } from '../constants';

interface EvaluationFormProps {
  initialData: Evaluation | null;
  onSubmit: (ev: Evaluation) => void;
  onCancel: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Evaluation>>(
    initialData || {
      firstName: '',
      lastName: '',
      academicYear: ACADEMIC_YEARS[0], // 1° Año por defecto
      trimester: TRIMESTERS[0],       // 1° Trimestre por defecto
      ratings: {},
    }
  );

  const handleRatingChange = (catId: string, itemId: string, value: RatingValue) => {
    const newRatings: EvaluationRatings = { ...formData.ratings as EvaluationRatings };
    if (!newRatings[catId]) newRatings[catId] = {};
    newRatings[catId][itemId] = value;
    setFormData({ ...formData, ratings: newRatings });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.academicYear || !formData.trimester) {
      return alert("Por favor, complete los nombres del residente.");
    }
    
    const evaluation: Evaluation = {
      id: formData.id || Math.random().toString(36).substr(2, 9),
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      academicYear: formData.academicYear!,
      trimester: formData.trimester!,
      date: formData.date || new Date().toISOString(),
      ratings: formData.ratings as EvaluationRatings || {},
    };
    onSubmit(evaluation);
  };

  const getRatingStyle = (value: number, isSelected: boolean) => {
    const base = "w-12 h-12 rounded-2xl font-black text-xs border-2 transition-all transform active:scale-95 flex items-center justify-center";
    if (!isSelected) return `${base} bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-500`;
    
    switch(value) {
      case 1: return `${base} bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200 -translate-y-1`;
      case 2: return `${base} bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200 -translate-y-1`;
      case 3: return `${base} bg-lime-500 text-white border-lime-500 shadow-lg shadow-lime-200 -translate-y-1`;
      case 4: return `${base} bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200 -translate-y-1`;
      default: return base;
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {initialData ? 'Editar' : 'Nueva'} <span className="text-blue-600">Evaluación</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Hospital Salvador B. Gautier</p>
        </div>
        <button type="button" onClick={onCancel} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-2xl shadow-blue-100/50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nombre</label>
            <input 
              type="text" 
              placeholder="Ej. Juan"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold placeholder:text-slate-300"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Apellido</label>
            <input 
              type="text" 
              placeholder="Ej. Pérez"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold placeholder:text-slate-300"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Año Académico</label>
            <select 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold appearance-none cursor-pointer"
              value={formData.academicYear}
              onChange={e => setFormData({...formData, academicYear: e.target.value})}
            >
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Trimestre</label>
            <select 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold appearance-none cursor-pointer"
              value={formData.trimester}
              onChange={e => setFormData({...formData, trimester: e.target.value})}
            >
              {TRIMESTERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {EVALUATION_STRUCTURE.map(cat => (
          <div key={cat.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100">
            <div className="bg-slate-900 text-white p-6">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{cat.id}</span>
              <h3 className="font-black text-lg uppercase tracking-tight mt-1">{cat.title}</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2">{cat.subtitle}</p>
            </div>
            <div className="divide-y divide-slate-50">
              {cat.items.map(item => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-blue-50/20 transition-colors">
                  <p className="text-sm font-bold text-slate-600 flex-1 pr-6 leading-relaxed">{item.label}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(v => (
                      <button 
                        key={v} 
                        type="button" 
                        onClick={() => handleRatingChange(cat.id, item.id, v.toString() as RatingValue)}
                        className={getRatingStyle(v, formData.ratings?.[cat.id]?.[item.id] === v.toString())}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl flex gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 font-black text-slate-400 hover:text-white uppercase tracking-widest text-[10px] transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-widest text-[10px]"
          >
            Finalizar Evaluación
          </button>
        </div>
      </div>
    </form>
  );
};

export default EvaluationForm;
