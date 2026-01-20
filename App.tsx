
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Evaluation, EvaluationRatings, RatingValue } from './types.ts';
import { ACADEMIC_YEARS, TRIMESTERS, EVALUATION_STRUCTURE } from './constants.ts';

// ID de contenedor público para el Hospital Gautier
const CLOUD_BIN_ID = '07d5810f63ca52f10f81'; 
const CLOUD_URL = `https://api.npoint.io/${CLOUD_BIN_ID}`;

// --- COMPONENTE: HEADER ---
const Header = ({ isSyncing, lastSync, onRefresh }) => (
  <header className="bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-30 no-print">
    <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shadow-inner">
          <i className="fas fa-hospital-user text-blue-600 text-2xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Hospital Salvador B. Gautier</h1>
          <p className="text-sm text-blue-600 font-medium mt-1">Emergenciología y Cuidados Críticos</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onRefresh} className={`p-2.5 rounded-xl transition-all ${isSyncing ? 'text-blue-600 bg-blue-50 animate-spin' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`} title="Sincronizar" disabled={isSyncing}>
          <i className="fas fa-sync-alt text-lg"></i>
        </button>
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className={`text-xs font-black uppercase tracking-widest ${isSyncing ? 'text-amber-600' : 'text-emerald-600'}`}>{isSyncing ? 'Sincronizando...' : 'En línea'}</span>
          </div>
          {lastSync && !isSyncing && (
            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Última: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>
      </div>
    </div>
  </header>
);

// --- COMPONENTE: STATS ---
const StatsOverview = ({ evaluations }) => {
  const total = evaluations.length;
  const calculateAverage = () => {
    if (total === 0) return '0.0';
    let sum = 0, count = 0;
    evaluations.forEach(ev => {
      Object.values(ev.ratings || {}).forEach(cat => {
        Object.values(cat).forEach(val => { if (val) { sum += parseInt(val as string); count++; } });
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
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02]">
          <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-xl`}><i className={`fas ${stat.icon}`}></i></div>
          <div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="text-2xl font-bold text-slate-900">{stat.value}</p></div>
        </div>
      ))}
    </div>
  );
};

// --- COMPONENTE: LIST ---
const EvaluationList = ({ evaluations, onEdit, onView }) => (
  <div className="grid grid-cols-1 gap-4">
    {evaluations.length === 0 ? (
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400"><i className="fas fa-search text-3xl mb-4"></i><p>No hay evaluaciones</p></div>
    ) : (
      evaluations.map(ev => (
        <div key={ev.id} className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">{ev.firstName[0]}{ev.lastName[0]}</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{ev.firstName} {ev.lastName}</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1">
                <span>{ev.academicYear}</span><span>{ev.trimester}</span><span>{new Date(ev.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
            <button onClick={() => onView(ev)} className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors"><i className="fas fa-eye"></i></button>
            <button onClick={() => onEdit(ev)} className="p-2.5 text-slate-400 hover:text-amber-600 transition-colors"><i className="fas fa-edit"></i></button>
          </div>
        </div>
      ))
    )}
  </div>
);

// --- COMPONENTE: FORM ---
const EvaluationForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || { firstName: '', lastName: '', academicYear: '', trimester: '', ratings: {} });
  const handleRatingChange = (catId, itemId, value) => {
    const newRatings = { ...formData.ratings };
    if (!newRatings[catId]) newRatings[catId] = {};
    newRatings[catId][itemId] = value;
    setFormData({ ...formData, ratings: newRatings });
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return alert("Complete los datos");
    onSubmit({ ...formData, id: formData.id || Math.random().toString(36).substr(2, 9), date: formData.date || new Date().toISOString() });
  };
  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
      <div className="bg-blue-600 p-8 text-white flex justify-between">
        <h2 className="text-2xl font-black">{initialData ? 'Editar Evaluación' : 'Nueva Evaluación'}</h2>
        <button type="button" onClick={onCancel} className="text-white/80 hover:text-white"><i className="fas fa-times text-xl"></i></button>
      </div>
      <div className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
          <input type="text" placeholder="Nombre" className="p-3 rounded-xl border bg-white" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
          <input type="text" placeholder="Apellido" className="p-3 rounded-xl border bg-white" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
          <select className="p-3 rounded-xl border bg-white" value={formData.academicYear} onChange={e => setFormData({ ...formData, academicYear: e.target.value })} required>
            <option value="">Año Académico</option>{ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="p-3 rounded-xl border bg-white" value={formData.trimester} onChange={e => setFormData({ ...formData, trimester: e.target.value })} required>
            <option value="">Trimestre</option>{TRIMESTERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {EVALUATION_STRUCTURE.map(cat => (
          <div key={cat.id} className="space-y-4">
            <h3 className="font-black text-slate-900 border-b pb-2 uppercase text-sm">{cat.id}. {cat.title}</h3>
            {cat.items.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between p-4 bg-white border rounded-xl gap-4">
                <p className="text-sm font-medium text-slate-600 flex-1">{item.label}</p>
                <div className="flex gap-2">
                  {['1','2','3','4'].map(v => (
                    <button key={v} type="button" onClick={() => handleRatingChange(cat.id, item.id, v)} 
                      className={`w-10 h-10 rounded-lg border font-bold transition-all ${formData.ratings[cat.id]?.[item.id] === v ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-8 bg-slate-50 border-t flex justify-end gap-4 sticky bottom-0">
        <button type="button" onClick={onCancel} className="px-6 py-3 font-bold text-slate-500">Cancelar</button>
        <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black shadow-lg">Guardar</button>
      </div>
    </form>
  );
};

// --- COMPONENTE: DETAIL ---
const EvaluationDetail = ({ evaluation, onBack, onEdit }) => {
  const detailRef = useRef(null);
  const exportPDF = async () => {
    const canvas = await html2canvas(detailRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Gautier_${evaluation.lastName}.pdf`);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm no-print">
        <button onClick={onBack} className="text-slate-600 font-bold"><i className="fas fa-arrow-left"></i> Volver</button>
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-4 py-2 font-bold text-amber-600">Editar</button>
          <button onClick={exportPDF} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold">Descargar PDF</button>
        </div>
      </div>
      <div ref={detailRef} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm print:p-0">
        <div className="text-center border-b-2 border-blue-600 pb-8 mb-8">
          <h2 className="text-xl font-black">HOSPITAL SALVADOR B. GAUTIER</h2>
          <p className="text-blue-600 font-bold uppercase text-xs tracking-widest mt-2">Residencia de Emergenciología y Cuidados Críticos</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          {[['Residente', `${evaluation.firstName} ${evaluation.lastName}`], ['Año', evaluation.academicYear], ['Periodo', evaluation.trimester], ['Fecha', new Date(evaluation.date).toLocaleDateString()]].map(([l, v]) => (
            <div key={l} className="bg-slate-50 p-4 rounded-xl">
              <span className="block text-[10px] uppercase font-bold text-slate-400">{l}</span>
              <span className="font-black text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="space-y-8">
          {EVALUATION_STRUCTURE.map(cat => (
            <div key={cat.id}>
              <h3 className="bg-slate-900 text-white p-3 rounded-t-xl text-xs font-bold uppercase tracking-wider">{cat.id}. {cat.title}</h3>
              <table className="w-full border text-xs">
                <tbody className="divide-y">
                  {cat.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-3 w-10 font-bold text-blue-600">{item.id}</td>
                      <td className="p-3">{item.label}</td>
                      <td className="p-3 w-20 text-center font-black bg-slate-50">{evaluation.ratings[cat.id]?.[item.id] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="mt-20 grid grid-cols-2 gap-20 px-10">
          {['Firma del Evaluador', 'Firma del Residente'].map(f => <div key={f} className="text-center border-t border-slate-900 pt-2 font-black text-[10px] uppercase">{f}</div>)}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: APP (MAIN) ---
const App = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [selectedEval, setSelectedEval] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => { fetchCloudData(); }, []);

  const fetchCloudData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(CLOUD_URL);
      if (response.ok) {
        const data = await response.json();
        setEvaluations(Array.isArray(data) ? data : []);
        setLastSync(new Date());
      }
    } catch (e) {
      console.error(e);
      const saved = localStorage.getItem('gautier_evals');
      if (saved) setEvaluations(JSON.parse(saved));
    } finally { setIsSyncing(false); }
  };

  const handleSubmit = async (evaluation) => {
    const exists = evaluations.findIndex(e => e.id === evaluation.id);
    const updated = exists > -1 ? evaluations.map(e => e.id === evaluation.id ? evaluation : e) : [evaluation, ...evaluations];
    setEvaluations(updated);
    setView('list');
    localStorage.setItem('gautier_evals', JSON.stringify(updated));
    setIsSyncing(true);
    try {
      await fetch(CLOUD_URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      setLastSync(new Date());
    } catch (e) { console.error(e); } finally { setIsSyncing(false); }
  };

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return evaluations.filter(e => e.firstName.toLowerCase().includes(s) || e.lastName.toLowerCase().includes(s)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [evaluations, searchTerm]);

  return (
    <div className="min-h-screen pb-12">
      <Header isSyncing={isSyncing} lastSync={lastSync} onRefresh={fetchCloudData} />
      <main className="container mx-auto px-4 max-w-6xl mt-8">
        {view === 'list' && (
          <div className="space-y-6 animate-fade-in">
            <StatsOverview evaluations={evaluations} />
            <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border">
              <input type="text" placeholder="Buscar residente..." className="flex-1 p-2 bg-slate-50 rounded-lg outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <button onClick={() => { setSelectedEval(null); setView('form'); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"><i className="fas fa-plus"></i></button>
            </div>
            <EvaluationList evaluations={filtered} onEdit={ev => { setSelectedEval(ev); setView('form'); }} onView={ev => { setSelectedEval(ev); setView('detail'); }} />
          </div>
        )}
        {view === 'form' && <EvaluationForm initialData={selectedEval} onSubmit={handleSubmit} onCancel={() => setView('list')} />}
        {view === 'detail' && selectedEval && <EvaluationDetail evaluation={selectedEval} onBack={() => setView('list')} onEdit={() => setView('form')} />}
      </main>
      <footer className="text-center mt-12 text-slate-400 text-xs uppercase tracking-widest no-print">Hospital Salvador B. Gautier</footer>
    </div>
  );
};

export default App;
