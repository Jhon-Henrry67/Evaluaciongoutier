
import { EvaluationCategory } from './types';

export const ACADEMIC_YEARS = ['1° Año', '2° Año', '3° Año', '4° Año'];
export const TRIMESTERS = ['1° Trimestre', '2° Trimestre', '3° Trimestre', '4° Trimestre'];

export const EVALUATION_STRUCTURE: EvaluationCategory[] = [
  {
    id: 'IA',
    title: 'IA. CUIDADO DEL PACIENTE',
    subtitle: 'MANEJO DEL PACIENTE',
    items: [
      { id: 'A', label: 'Mantenimiento de la salud y prevención de enfermedades' },
      { id: 'B', label: 'Manejo farmacológico' },
      { id: 'C', label: 'Seguimiento a enfermedades recurrentes' },
      { id: 'D', label: 'Manejo de la fisiopatología de las enfermedades' },
      { id: 'E', label: 'Intervención clínica y manejo de diagnósticos diferenciales' },
    ],
  },
  {
    id: 'IB',
    title: 'IB. APRENDIZAJE BASADO EN LA PRÁCTICA',
    subtitle: 'CONOCIMIENTOS EN NEUROCIENCIA',
    items: [
      { id: 'A', label: 'Conocimientos y aplicación de principio de bioestadística y epidemiología' },
      { id: 'B', label: 'Aplicación de la información de investigación en la práctica clínica' },
      { id: 'C', label: 'Entendimiento de los principios éticos y legales en medicina de emergencia' },
    ],
  },
  {
    id: 'II',
    title: 'II. DESTREZAS Y HABILIDADES',
    subtitle: 'VALORACIÓN DE LAS DESTREZAS Y HABILIDADES',
    items: [
      { id: 'A', label: 'Destreza para explicar ideas y procedimientos tanto en forma oral y escrito' },
      { id: 'B', label: 'Realizar preguntas pertinentes al caso del paciente o el tema' },
      { id: 'C', label: 'Hacer comentarios útiles y de enseñanza' },
      { id: 'D', label: 'Diseñar buena investigación de interés científico' },
      { id: 'E', label: 'Adecuada organización y administración del tiempo' },
    ],
  },
  {
    id: 'III',
    title: 'III. CAPACIDADES',
    subtitle: 'CAPACIDAD',
    items: [
      { id: 'A', label: 'Pensamiento crítico y lógico' },
      { id: 'B', label: 'Manejo del estrés' },
      { id: 'C', label: 'Sensibilidad y empatía' },
      { id: 'D', label: 'Resolución de problemas' },
    ],
  },
  {
    id: 'IV',
    title: 'IV. ACTITUDES',
    subtitle: 'MUESTRA ACTITUDES ANTE',
    items: [
      { id: 'A', label: 'Actitud positiva y dispuesto a trabajar en equipo' },
      { id: 'B', label: 'Muestra proactividad, ideas y busca soluciones en equipo' },
      { id: 'C', label: 'Escucha y respeta acatando las decisiones del equipo' },
      { id: 'D', label: 'Comunica respetando las ordenes jerárquicas ante la toma de decisiones' },
      { id: 'E', label: 'Escucha y respeta acatando las decisiones del equipo' },
      { id: 'F', label: 'Muestra mejora ante observaciones y/o correcciones previas' },
    ],
  },
];
