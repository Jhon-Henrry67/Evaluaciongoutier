
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-30 no-print">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <i className="fas fa-hospital-user text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              Hospital Salvador B. Gautier
            </h1>
            <p className="text-sm text-blue-600 font-medium mt-1">
              Emergenciología y Cuidados Críticos
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            Sistema de Evaluación Pro
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
