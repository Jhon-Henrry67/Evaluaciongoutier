
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
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <button onClick={onBack} className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Volver al listado
        </button>
        <div className="flex gap-2">
           <button onClick={onEdit} className="bg-amber-50 text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-100 transition-colors">
            <i className="fas fa-edit mr-2"></i> Editar
          </button>
          <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <i className="fas fa-file-pdf mr-2"></i> Descargar PDF
          </button>
        </div>
      </div>

      <div 
        ref={detailRef} 
        className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm print:p-0 print:border-none print:shadow-none"
      >
        <div className="text-center border-b-2 border-blue-600 pb-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">RESIDENCIA DE EMERGENCIOLOGÍA Y CUIDADOS CRÍTICOS</h2>
          <h3 className="text-xl font-semibold text-slate-700 mt-1 uppercase">HOSPITAL SALVADOR B. GAUTIER</h3>
          <p className="text-blue-600 font-bold mt-4 tracking-wider uppercase text-sm">Formulario de Evaluación de Competencias del Residente</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Residente</span>
            <span className="font-bold text-slate-900">{evaluation.firstName} {evaluation.lastName}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Año Académico</span>
            <span className="font-bold text-slate-900">{evaluation.academicYear}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Trimestre</span>
            <span className="font-bold text-slate-900">{evaluation.trimester}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Fecha</span>
            <span className="font-bold text-slate-900">{new Date(evaluation.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-10">
          {EVALUATION_STRUCTURE.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-t-lg">
                <span className="font-black text-blue-400">{cat.id}</span>
                <span className="font-bold text-sm tracking-wide">{cat.title}</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                    <th className="border border-slate-200 px-4 py-2 w-12">Item</th>
                    <th className="border border-slate-200 px-4 py-2">{cat.subtitle}</th>
                    <th className="border border-slate-200 px-4 py-2 w-32 text-center">Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item) => {
                    const val = evaluation.ratings[cat.id]?.[item.id] || '';
                    return (
                      <tr key={item.id} className="text-sm">
                        <td className="border border-slate-200 px-4 py-3 font-bold text-slate-900 text-center">{item.id}</td>
                        <td className="border border-slate-200 px-4 py-3 text-slate-600">{item.label}</td>
                        <td className="border border-slate-200 px-4 py-3">
                          <div className={`text-center px-2 py-1 rounded font-bold text-xs ${getRatingColor(val)}`}>
                            {val ? `${val} - ${getRatingLabel(val)}` : 'N/C'}
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

        <div className="mt-24 grid grid-cols-2 gap-16 px-12">
          <div className="text-center">
            <div className="border-t-2 border-slate-900 pt-3">
              <p className="font-bold text-sm text-slate-900">FIRMA DEL EVALUADOR</p>
              <p className="text-slate-400 text-xs mt-1 italic">Nombre y Cédula</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-900 pt-3">
              <p className="font-bold text-sm text-slate-900">FIRMA DEL EVALUADO</p>
              <p className="text-slate-400 text-xs mt-1 italic">Residente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetail;
