
import React from 'react';

interface HeaderProps {
  isSyncing?: boolean;
  lastSync?: Date | null;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSyncing, lastSync, onRefresh }) => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-30 no-print">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shadow-inner">
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

        <div className="flex items-center gap-6">
          <button 
            onClick={onRefresh}
            className={`p-2.5 rounded-xl transition-all ${isSyncing ? 'text-blue-600 bg-blue-50 animate-spin' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
            title="Sincronizar ahora"
            disabled={isSyncing}
          >
            <i className="fas fa-sync-alt text-lg"></i>
          </button>

          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-sm shadow-emerald-200'}`}></span>
              <span className={`text-xs font-black uppercase tracking-widest ${isSyncing ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isSyncing ? 'Sincronizando...' : 'En línea'}
              </span>
            </div>
            {lastSync && !isSyncing && (
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                Última sincronización: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
