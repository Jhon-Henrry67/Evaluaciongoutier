
import React, { useRef } from 'react';
import { Evaluation } from '../types';
import { EVALUATION_STRUCTURE } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface EvaluationDetailProps {
  evaluation: Evaluation;
  onBack: () => void;
  onEdit: () => void;
}

const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ evaluation, onBack, onEdit }) => {
  const detailRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!detailRef.current) return;
    
    const element = detailRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Eval_${evaluation.lastName}_${evaluation.firstName}_${new Date(evaluation.date).toLocaleDateString()}.pdf`);
  };

  const getRatingColor = (val: string) => {
    switch (val) {
      case '4': return 'text-emerald-600 bg-emerald-50';
      case '3': return 'text-blue-600 bg-blue-50';
      case '2': return 'text-amber-600 bg-amber-50';
      case '1': return 'text-red-600 bg-red-50';
      default: return 'text-slate-400 bg-slate-50';
    }
  };

  const getRatingLabel = (val: string) => {
    switch (val) {
      case '4': return 'Excelente';
      case '3': return 'Bueno';
      case '2': return 'Regular';
      case '1': return 'Insuficiente';
      default: return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-[72px] z-20">
        <button type="button" onClick={onBack} className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-2 px-4 py-2 transition-colors">
          <i className="fas fa-arrow-left"></i> Volver
        </button>
        <div className="flex gap-2">
           <button type="button" onClick={onEdit} className="bg-amber-50 text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors">
            <i className="fas fa-edit mr-2"></i> Editar
          </button>
          <button type="button" onClick={exportPDF} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <i className="fas fa-file-pdf mr-2"></i> Descargar PDF
          </button>
        </div>
      </div>

      <div 
        ref={detailRef} 
        className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm print:p-0 print:border-none print:shadow-none"
      >
        <div className="text-center border-b-2 border-blue-600 pb-8 mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">RESIDENCIA DE EMERGENCIOLOGÍA Y CUIDADOS CRÍTICOS</h2>
          <h3 className="text-xl font-bold text-slate-700 mt-1 uppercase">HOSPITAL SALVADOR B. GAUTIER</h3>
          <p className="text-blue-600 font-black mt-4 tracking-widest uppercase text-sm">Formulario de Evaluación de Competencias del Residente</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-sm">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1 tracking-wider">Residente</span>
            <span className="font-black text-slate-900 text-base">{evaluation.firstName} {evaluation.lastName}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1 tracking-wider">Año Académico</span>
            <span className="font-black text-slate-900 text-base">{evaluation.academicYear}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1 tracking-wider">Trimestre</span>
            <span className="font-black text-slate-900 text-base">{evaluation.trimester}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1 tracking-wider">Fecha</span>
            <span className="font-black text-slate-900 text-base">{new Date(evaluation.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-12">
          {EVALUATION_STRUCTURE.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-t-2xl">
                <span className="font-black text-blue-400 text-lg">{cat.id}</span>
                <span className="font-bold text-sm tracking-widest uppercase">{cat.title}</span>
              </div>
              <table className="w-full text-left border-collapse overflow-hidden rounded-b-2xl border-x border-b border-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="border-b border-slate-200 px-6 py-3 w-16 text-center">ID</th>
                    <th className="border-b border-slate-200 px-6 py-3">{cat.subtitle}</th>
                    <th className="border-b border-slate-200 px-6 py-3 w-40 text-center">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cat.items.map((item) => {
                    const val = evaluation.ratings[cat.id]?.[item.id] || '';
                    return (
                      <tr key={item.id} className="text-sm hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-black text-blue-600 text-center">{item.id}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{item.label}</td>
                        <td className="px-6 py-4">
                          <div className={`text-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-tighter ${getRatingColor(val)}`}>
                            {val ? `${val} - ${getRatingLabel(val)}` : 'No calificado'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-28 grid grid-cols-2 gap-20 px-12">
          <div className="text-center">
            <div className="h-0.5 bg-slate-900 mb-4"></div>
            <p className="font-black text-xs text-slate-900 tracking-widest uppercase">FIRMA DEL EVALUADOR</p>
            <p className="text-slate-400 text-[10px] mt-1 font-bold italic uppercase">Nombre, Sello y Cédula</p>
          </div>
          <div className="text-center">
            <div className="h-0.5 bg-slate-900 mb-4"></div>
            <p className="font-black text-xs text-slate-900 tracking-widest uppercase">FIRMA DEL EVALUADO</p>
            <p className="text-slate-400 text-[10px] mt-1 font-bold italic uppercase">Residente en Formación</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetail;
