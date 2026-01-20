
import React, { useState, useEffect, useMemo } from 'react';
import { Evaluation } from './types';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import EvaluationList from './components/EvaluationList';
import EvaluationForm from './components/EvaluationForm';
import EvaluationDetail from './components/EvaluationDetail';

const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('gautier_evals');
    if (saved) {
      try {
        setEvaluations(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading evaluations", e);
      }
    }
  }, []);

  const saveToLocal = (data: Evaluation[]) => {
    setEvaluations(data);
    localStorage.setItem('gautier_evals', JSON.stringify(data));
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

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      const updated = evaluations.filter(e => e.id !== id);
      saveToLocal(updated);
    }
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
    saveToLocal(updated);
    setView('list');
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 max-w-6xl mt-8">
        {view === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-500">
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
              onDelete={handleDelete}
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
            onEdit={() => setView('form')}
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-slate-400 text-sm no-print">
        <p>&copy; {new Date().getFullYear()} Hospital Salvador B. Gautier. Departamento de Docencia.</p>
      </footer>
    </div>
  );
};

export default App;
