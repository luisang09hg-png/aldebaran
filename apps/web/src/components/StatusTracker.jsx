import React from 'react';

const STATUS_STAGES = [
  { key: 'SUBMITTED', label: 'Enviado' },
  { key: 'IN_REVIEW', label: 'En Revisión' },
  { key: 'INTERVIEW', label: 'Entrevista' },
  { key: 'ACCEPTED', label: 'Resolución' }
];

export const StatusTracker = ({ currentStatus }) => {
  const currentIndex = STATUS_STAGES.findIndex(s => s.key === currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  // Si el estado es REJECTED o no se encuentra (ej. pending inicial), manejamos visualmente
  const effectiveIndex = isRejected ? 3 : (currentIndex >= 0 ? currentIndex : 0);

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between relative">
        {/* Barra de fondo */}
        <div className="absolute left-0 top-4 w-full h-1 bg-gray-200 rounded"></div>
        
        {/* Barra activa */}
        <div 
          className={`absolute left-0 top-4 h-1 rounded transition-all duration-700 ease-in-out ${isRejected ? 'bg-red-500' : 'bg-blue-600'}`}
          style={{ width: `${(effectiveIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
        ></div>

        {/* Puntos (Nodos) */}
        {STATUS_STAGES.map((stage, index) => {
          const isCompleted = index <= effectiveIndex;
          const isCurrent = index === effectiveIndex;
          
          let circleClasses = 'bg-white border-gray-300 text-gray-400';
          let textClasses = 'text-gray-500';

          if (isCompleted && !isRejected) {
            circleClasses = 'bg-blue-600 border-blue-600 text-white';
            if (isCurrent) textClasses = 'text-blue-700 font-semibold';
          } else if (isRejected && isCurrent) {
            circleClasses = 'bg-red-500 border-red-500 text-white';
            textClasses = 'text-red-600 font-semibold';
          }

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-500 shadow-sm ${circleClasses}`}
              >
                {isCompleted && (!isRejected || index < effectiveIndex) ? '✓' : index + 1}
              </div>
              <span className={`mt-3 text-sm ${textClasses}`}>
                {isRejected && isCurrent ? 'Rechazado' : stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
