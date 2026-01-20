
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
    if (!formData.firstName || !formData.lastName || !formData.academicYear || !formData.trimester) {
      alert("Por favor complete todos los datos generales.");
      return;
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

  const ratingOptions = [
    { value: '1', label: '1', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white', active: 'bg-red-500 text-white border-red-500' },
    { value: '2', label: '2', color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white', active: 'bg-amber-500 text-white border-amber-500' },
    { value: '3', label: '3', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white', active: 'bg-blue-500 text-white border-blue-500' },
    { value: '4', label: '4', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white', active: 'bg-emerald-500 text-white border-emerald-500' },
  ];

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{initialData ? 'Modificar Evaluación' : 'Nueva Evaluación de Competencias'}</h2>
          <p className="text-blue-100/80 text-sm mt-1 flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            Gestione el progreso académico de los residentes del Gautier
          </p>
        </div>
        <button type="button" onClick={onCancel} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:rotate-90">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <div className="p-8 space-y-12">
        {/* Basic Info Section */}
        <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-user text-blue-500"></i> Nombre del Residente
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white font-medium"
              placeholder="Ej. Juan"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-id-card text-blue-500"></i> Apellido
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white font-medium"
              placeholder="Ej. Pérez"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-graduation-cap text-blue-500"></i> Año Académico
            </label>
            <div className="relative">
              <select 
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white appearance-none font-medium cursor-pointer"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                required
              >
                <option value="">Seleccione el año...</option>
                {ACADEMIC_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-chart-pie text-blue-500"></i> Trimestre a Evaluar
            </label>
            <div className="relative">
              <select 
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white appearance-none font-medium cursor-pointer"
                value={formData.trimester}
                onChange={e => setFormData({ ...formData, trimester: e.target.value })}
                required
              >
                <option value="">Seleccione el periodo...</option>
                {TRIMESTERS.map(tri => <option key={tri} value={tri}>{tri}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {EVALUATION_STRUCTURE.map((cat) => (
          <div key={cat.id} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-100 pb-4 gap-2">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100">
                  {cat.id}
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">{cat.title}</h3>
                  <p className="text-blue-500 text-sm font-semibold mt-1">{cat.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter hidden md:flex">
                <span>1 Insuficiente</span>
                <span>2 Regular</span>
                <span>3 Bueno</span>
                <span>4 Excelente</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {cat.items.map((item) => {
                const currentRating = formData.ratings?.[cat.id]?.[item.id];
                return (
                  <div key={item.id} className="group flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="w-7 h-7 flex-shrink-0 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                        {item.id}
                      </span>
                      <p className="text-slate-600 text-sm font-medium leading-tight pt-1">
                        {item.label}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {ratingOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleRatingChange(cat.id, item.id, opt.value as RatingValue)}
                          className={`w-12 h-10 rounded-xl border flex items-center justify-center font-black transition-all transform active:scale-90 ${
                            currentRating === opt.value
                              ? opt.active
                              : opt.color
                          }`}
                          title={opt.label}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <div className="w-px h-6 bg-slate-100 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => handleRatingChange(cat.id, item.id, '')}
                        className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center ${
                          currentRating 
                            ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white' 
                            : 'bg-slate-50 text-slate-300 border-slate-100 cursor-default'
                        }`}
                        title="Borrar calificación"
                      >
                        <i className="fas fa-eraser"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 sticky bottom-0 z-20">
        <div className="flex items-center gap-3 text-slate-400">
           <i className="fas fa-shield-alt text-xl text-emerald-500"></i>
           <p className="text-xs font-medium">Los datos se guardan de forma local y segura en este dispositivo.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-200"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2 group"
          >
            <span>{initialData ? 'Actualizar Evaluación' : 'Guardar Evaluación'}</span>
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default EvaluationForm;
