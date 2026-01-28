
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
      academicYear: '', 
      trimester: '',    
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
    if (!formData.firstName || !formData.lastName) {
      return alert("Por favor, ingresa el nombre y apellido del residente.");
    }
    if (!formData.academicYear) {
      return alert("Por favor, selecciona tu año académico.");
    }
    if (!formData.trimester) {
      return alert("Por favor, selecciona el trimestre.");
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
    const base = "w-11 h-11 md:w-12 md:h-12 rounded-2xl font-black text-xs border-2 transition-all transform active:scale-90 flex items-center justify-center shadow-sm";
    if (!isSelected) return `${base} bg-white text-slate-300 border-slate-100 hover:border-blue-200`;
    
    switch(value) {
      case 1: return `${base} bg-rose-500 text-white border-rose-500 shadow-rose-200 -translate-y-1`;
      case 2: return `${base} bg-orange-500 text-white border-orange-500 shadow-orange-200 -translate-y-1`;
      case 3: return `${base} bg-lime-500 text-white border-lime-500 shadow-lime-200 -translate-y-1`;
      case 4: return `${base} bg-emerald-600 text-white border-emerald-600 shadow-emerald-200 -translate-y-1`;
      default: return base;
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-32 px-2">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {initialData ? 'Editar' : 'Nueva'} <span className="text-blue-600">Evaluación</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Hospital Salvador B. Gautier</p>
        </div>
        <button type="button" onClick={onCancel} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-blue-50 shadow-2xl shadow-blue-100/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nombre del Residente</label>
            <input 
              type="text" 
              placeholder="Ej. Juan"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Apellido del Residente</label>
            <input 
              type="text" 
              placeholder="Ej. Pérez"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Año Académico</label>
            <div className="relative">
              <select 
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold appearance-none cursor-pointer ${!formData.academicYear ? 'text-slate-400' : 'text-slate-900'}`}
                value={formData.academicYear}
                onChange={e => setFormData({...formData, academicYear: e.target.value})}
                required
              >
                <option value="" disabled>Coloca tu año...</option>
                {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Trimestre</label>
            <div className="relative">
              <select 
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold appearance-none cursor-pointer ${!formData.trimester ? 'text-slate-400' : 'text-slate-900'}`}
                value={formData.trimester}
                onChange={e => setFormData({...formData, trimester: e.target.value})}
                required
              >
                <option value="" disabled>Coloca el trimestre...</option>
                {TRIMESTERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {EVALUATION_STRUCTURE.map(cat => (
          <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-[10px]">{cat.id}</span>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{cat.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {cat.items.map(item => (
                <div key={item.id} className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <p className="text-sm font-bold text-slate-600 flex-1 leading-relaxed">{item.label}</p>
                  <div className="flex gap-2 self-end sm:self-center">
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

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] border border-white/10 shadow-2xl flex gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 font-black text-slate-400 hover:text-white uppercase tracking-widest text-[9px] transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-widest text-[10px]"
          >
            Guardar Trabajo
          </button>
        </div>
      </div>
    </form>
  );
};

export default EvaluationForm;
