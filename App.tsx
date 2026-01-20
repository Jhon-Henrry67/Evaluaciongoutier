
import React, { useState, useEffect, useMemo } from 'react';
import { Evaluation } from './types.ts';
import Header from './components/Header.tsx';
import StatsOverview from './components/StatsOverview.tsx';
import EvaluationList from './components/EvaluationList.tsx';
import EvaluationForm from './components/EvaluationForm.tsx';
import EvaluationDetail from './components/EvaluationDetail.tsx';

// ID de contenedor público para el Hospital Gautier
const CLOUD_BIN_ID = '07d5810f63ca52f10f81'; 
const CLOUD_URL = `https://api.npoint.io/${CLOUD_BIN_ID}`;

const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Carga inicial desde la nube
  useEffect(() => {
    fetchCloudData();
    // Sincronizar automáticamente cada 60 segundos para no saturar
    const interval = setInterval(fetchCloudData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCloudData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(CLOUD_URL);
      if (response.ok) {
        const data = await response.json();
        const remoteEvals = Array.isArray(data) ? data : [];
        setEvaluations(remoteEvals);
        setLastSync(new Date());
      }
    } catch (e) {
      console.error("Error cargando datos de la nube", e);
      const saved = localStorage.getItem('gautier_evals');
      if (saved) setEvaluations(JSON.parse(saved));
    } finally {
      setIsSyncing(false);
    }
  };

  const saveToCloud = async (data: Evaluation[]) => {
    setIsSyncing(true);
    try {
      // Guardamos en LocalStorage siempre como respaldo
      localStorage.setItem('gautier_evals', JSON.stringify(data));

      // Enviamos a la nube usando PUT para reemplazar el contenido completo
      const response = await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setLastSync(new Date());
      }
    } catch (e) {
      console.error("Error guardando en la nube", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredEvaluations = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return evaluations.filter(ev => 
      ev.firstName.toLowerCase().includes(lowerSearch) ||
      ev.lastName.toLowerCase().includes(lowerSearch) ||
      ev.academicYear.toLowerCase().includes(lowerSearch) ||
      ev.trimester.toLowerCase().includes(lowerSearch)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [evaluations, searchTerm]);

  const handleAdd = () => {
    setSelectedEval(null);
    setView('form');
  };

  const handleEdit = (evaluation: Evaluation) => {
    setSelectedEval(evaluation);
    setView('form');
  };

  const handleView = (evaluation: Evaluation) => {
    setSelectedEval(evaluation);
    setView('detail');
  };

  const handleSubmit = (evaluation: Evaluation) => {
    const exists = evaluations.findIndex(e => e.id === evaluation.id);
    let updated: Evaluation[];
    if (exists > -1) {
      updated = [...evaluations];
      updated[exists] = evaluation;
    } else {
      updated = [evaluation, ...evaluations];
    }
    
    // Actualización inmediata
    setEvaluations(updated);
    setView('list');
    
    // Sincronización en segundo plano
    saveToCloud(updated);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Header isSyncing={isSyncing} lastSync={lastSync} onRefresh={fetchCloudData} />
      
      <main className="flex-1 container mx-auto px-4 max-w-6xl mt-8">
        {view === 'list' && (
          <div className="space-y-6 animate-fade-in">
            <StatsOverview evaluations={evaluations} />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Buscar residente, año o trimestre..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                type="button"
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <i className="fas fa-plus-circle"></i>
                <span>Nueva Evaluación</span>
              </button>
            </div>

            <EvaluationList 
              evaluations={filteredEvaluations} 
              onEdit={handleEdit} 
              onView={handleView}
            />
          </div>
        )}

        {view === 'form' && (
          <EvaluationForm 
            initialData={selectedEval} 
            onSubmit={handleSubmit} 
            onCancel={() => setView('list')} 
          />
        )}

        {view === 'detail' && selectedEval && (
          <EvaluationDetail 
            evaluation={selectedEval} 
            onBack={() => setView('list')}
            onEdit={() => handleEdit(selectedEval)}
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-slate-400 text-sm no-print">
        <p>&copy; {new Date().getFullYear()} Hospital Salvador B. Gautier. Departamento de Docencia.</p>
        <p className="mt-1 text-[10px] opacity-50 uppercase tracking-widest">Global Sync Enabled (Cloud DB)</p>
      </footer>
    </div>
  );
};

export default App;
