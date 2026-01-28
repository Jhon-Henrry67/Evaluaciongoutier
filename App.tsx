
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import EvaluationList from './components/EvaluationList';
import EvaluationForm from './components/EvaluationForm';
import EvaluationDetail from './components/EvaluationDetail';
import { Evaluation } from './types';

// Contenedor JSON público para sincronización multi-dispositivo
const CLOUD_URL = 'https://api.npoint.io/07d5810f63ca52f10f81';

const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Al cargar, siempre busca los datos más recientes de la nube
  useEffect(() => {
    fetchCloudData();
    
    // Auto-refresco cada 2 minutos para ver cambios de otros usuarios
    const interval = setInterval(fetchCloudData, 120000);
    return () => clearInterval(interval);
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
      console.error("Error de conexión:", e);
      // Si falla la nube, usar local como respaldo
      const local = localStorage.getItem('gautier_evals');
      if (local) setEvaluations(JSON.parse(local));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async (evaluation: Evaluation) => {
    setIsSyncing(true);
    try {
      // 1. Obtener datos actuales de la nube para no sobreescribir lo de otros
      const res = await fetch(CLOUD_URL);
      let currentData: Evaluation[] = [];
      if (res.ok) {
        currentData = await res.json();
      }

      // 2. Integrar el nuevo registro
      const existsIdx = currentData.findIndex(e => e.id === evaluation.id);
      let updated: Evaluation[];
      if (existsIdx > -1) {
        updated = [...currentData];
        updated[existsIdx] = evaluation;
      } else {
        updated = [evaluation, ...currentData];
      }

      // 3. Guardar en la nube y local
      const saveRes = await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (saveRes.ok) {
        setEvaluations(updated);
        localStorage.setItem('gautier_evals', JSON.stringify(updated));
        setLastSync(new Date());
        setView('list');
      } else {
        throw new Error("Error al guardar en nube");
      }
    } catch (e) {
      alert("Error de sincronización. Comprueba tu conexión a internet.");
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredEvals = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return evaluations.filter(e => 
      `${e.firstName} ${e.lastName} ${e.academicYear}`.toLowerCase().includes(s)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [evaluations, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Header isSyncing={isSyncing} lastSync={lastSync} onRefresh={fetchCloudData} />
      
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl flex-1">
        {view === 'list' && (
          <div className="space-y-8 animate-fade-in">
            <StatsOverview evaluations={evaluations} />
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:flex-1 relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="text" 
                  placeholder="Buscar residente o año..."
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 transition-all font-semibold shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setSelectedEval(null); setView('form'); }}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-black transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group active:scale-95"
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
      
      <footer className="py-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] no-print">
        Hospital Salvador B. Gautier • Cloud Sync v2.5
      </footer>
    </div>
  );
};

export default App;
