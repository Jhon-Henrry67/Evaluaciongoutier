
import React, { useRef, useState } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const downloadPDF = async () => {
    if (!ref.current) return;
    setIsExporting(true);
    
    try {
      const element = ref.current;
      
      // Capturamos el contenido. Eliminamos temporalmente clases de redondeado que cortan el canvas
      const canvas = await html2canvas(element, { 
        scale: 2, 
        logging: false, 
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Forzamos un ancho estable para la captura
        onclone: (clonedDoc) => {
          // Aseguramos que el clon no tenga nada oculto
          const clonedEl = clonedDoc.querySelector('[data-pdf-content]') as HTMLElement;
          if (clonedEl) {
            clonedEl.style.height = 'auto';
            clonedEl.style.overflow = 'visible';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; 
      const pageHeight = 295; // Margen de seguridad
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Páginas adicionales si el contenido excede el A4
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Gautier_${evaluation.lastName}.pdf`);
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al generar el PDF. Por favor intente en un navegador moderno.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center no-print px-4">
        <button onClick={onBack} className="group font-black text-slate-400 hover:text-blue-600 flex items-center gap-2 uppercase tracking-widest text-[10px] transition-all">
          <i className="fas fa-long-arrow-alt-left group-hover:-translate-x-1 transition-transform"></i> Volver
        </button>
        <div className="flex gap-4">
          <button onClick={onEdit} className="px-6 py-3 rounded-2xl font-black bg-white text-slate-600 border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-[10px] tracking-widest uppercase">
            Editar
          </button>
          <button 
            onClick={downloadPDF} 
            disabled={isExporting}
            className={`px-8 py-3 rounded-2xl font-black text-white shadow-xl transition-all text-[10px] tracking-widest uppercase flex items-center gap-2 ${isExporting ? 'bg-slate-400 cursor-wait' : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'}`}
          >
            {isExporting ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-file-pdf"></i>}
            {isExporting ? 'Procesando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div ref={ref} data-pdf-content className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 print:shadow-none print:p-8 overflow-visible">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-blue-100">
            <i className="fas fa-hospital text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Hospital Salvador B. Gautier</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
          <p className="text-blue-600 font-black uppercase text-[11px] tracking-[0.4em] mt-2">Residencia de Emergenciología y Cuidados Críticos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {[
            ['Residente', `${evaluation.firstName} ${evaluation.lastName}`, 'fa-user'],
            ['Año Académico', evaluation.academicYear, 'fa-graduation-cap'],
            ['Periodo Trimestral', evaluation.trimester, 'fa-clock'],
            ['Fecha de Evaluación', new Date(evaluation.date).toLocaleDateString(), 'fa-calendar-check']
          ].map(([l, v, i]) => (
            <div key={l as string} className="bg-slate-50/80 p-6 rounded-3xl border border-white flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <i className={`fas ${i}`}></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{l as string}</p>
                <p className="font-black text-slate-900 text-lg leading-none">{v as string}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          {EVALUATION_STRUCTURE.map(cat => (
            <div key={cat.id} className="break-inside-avoid">
              <h3 className="bg-slate-900 text-white px-8 py-5 rounded-t-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em]">
                {cat.id}. {cat.title}
              </h3>
              <div className="border-x border-b border-slate-100 rounded-b-[2.5rem] overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    {cat.items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 w-16 font-black text-blue-600 text-xs border-r border-slate-50 text-center">{item.id}</td>
                        <td className="p-5 text-xs font-bold text-slate-600 leading-relaxed">{item.label}</td>
                        <td className="p-5 w-24 text-center">
                          <span className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black text-base">
                            {evaluation.ratings[cat.id]?.[item.id] || '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 grid grid-cols-2 gap-32 px-12 pb-12">
          <div className="text-center">
            <div className="h-[2px] bg-slate-200 mb-4"></div>
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-900">Firma del Evaluador</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Docencia Médica</p>
          </div>
          <div className="text-center">
            <div className="h-[2px] bg-slate-200 mb-4"></div>
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-900">Firma del Residente</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Aceptación</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetail;
