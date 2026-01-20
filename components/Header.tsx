
import React from 'react';

interface HeaderProps {
  isSyncing: boolean;
  lastSync: Date | null;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSyncing, lastSync, onRefresh }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40 no-print">
    <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <i className="fas fa-hospital-user text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">Gautier</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Emergenciología</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isSyncing ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
            {isSyncing ? 'Sincronizando' : 'Sistema Activo'}
          </span>
          {lastSync && (
            <span className="text-[9px] text-slate-400 font-bold">Refresco: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>
        <button 
          onClick={onRefresh}
          className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center ${isSyncing ? 'animate-spin text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'}`}
        >
          <i className="fas fa-sync-alt text-sm"></i>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
