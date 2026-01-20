
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import EvaluationList from './components/EvaluationList';
import EvaluationForm from './components/EvaluationForm';
import EvaluationDetail from './components/EvaluationDetail';
import { Evaluation } from './types';

const CLOUD_URL = 'https://api.npoint.io/07d5810f63ca52f10f81';

const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem('gautier_evals');
    if (localData) setEvaluations(JSON.parse(localData));
    fetchCloudData();
  }, []);

  const fetchCloudData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(CLOUD_URL);
      if (res.ok) {
        const data = await res.json();
        const cleanData = Array.isArray(data) ? data : [];
        setEvaluations(cleanData);
        localStorage.setItem('gautier_evals', JSON.stringify(cleanData));
        setLastSync(new Date());
      }
    } catch (e) {
      console.error("Error al sincronizar:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveToCloud = async (newData: Evaluation[]) => {
    setIsSyncing(true);
    try {
      await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      setLastSync(new Date());
    } catch (e) {
      console.error("Error al guardar en la nube:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = (evaluation: Evaluation) => {
    const exists = evaluations.findIndex(e => e.id === evaluation.id);
    let updated: Evaluation[];
    if (exists > -1) {
      updated = [...evaluations];
      updated[exists] = evaluation;
    } else {
      updated = [evaluation, ...evaluations];
    }
    setEvaluations(updated);
    localStorage.setItem('gautier_evals', JSON.stringify(updated));
    saveToCloud(updated);
    setView('list');
  };

  const filteredEvals = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return evaluations.filter(e => 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(s)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [evaluations, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header isSyncing={isSyncing} lastSync={lastSync} onRefresh={fetchCloudData} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {view === 'list' && (
          <div className="space-y-8 animate-fade-in">
            <StatsOverview evaluations={evaluations} />
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:flex-1 relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="text" 
                  placeholder="Buscar residente..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setSelectedEval(null); setView('form'); }}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
              >
                <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
                Nueva Evaluación
              </button>
            </div>

            <EvaluationList 
              evaluations={filteredEvals} 
              onEdit={(ev) => { setSelectedEval(ev); setView('form'); }} 
              onView={(ev) => { setSelectedEval(ev); setView('detail'); }} 
            />
          </div>
        )}

        {view === 'form' && (
          <div className="animate-fade-in">
            <EvaluationForm 
              initialData={selectedEval} 
              onSubmit={handleSave} 
              onCancel={() => setView('list')} 
            />
          </div>
        )}

        {view === 'detail' && selectedEval && (
          <div className="animate-fade-in">
            <EvaluationDetail 
              evaluation={selectedEval} 
              onBack={() => setView('list')} 
              onEdit={() => setView('form')} 
            />
          </div>
        )}
      </main>
      
      <footer className="py-8 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest no-print">
        Hospital Salvador B. Gautier • Docencia Médica • v2.1
      </footer>
    </div>
  );
};

export default App;
