import React from 'react';

export const CourseCard = ({ course }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-lg hover:-translate-y-1 hover:shadow-blue-500/10 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Contenedor de la miniatura */}
      <div className="h-48 w-full relative bg-slate-700">
        <img 
          src={course.thumbnailUrl || 'https://via.placeholder.com/400x250?text=Course'} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      </div>

      {/* Cuerpo del contenido */}
      <div className="p-5 flex flex-col gap-3 flex-grow bg-slate-800 relative -mt-4 rounded-t-xl">
        
        {/* Badges */}
        <div className="flex gap-2">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-1 rounded-md">
            {course.level}
          </span>
          <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-md">
            {course.category}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-1">
          <img 
            src={course.instructor.avatar} 
            alt={course.instructor.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-400 font-medium">
            {course.instructor.name}
          </span>
        </div>

        {/* Metadatos */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {course.duration}h
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              {course.modules} mód.
            </span>
          </div>
          <span className="flex items-center gap-1 text-yellow-400 font-bold">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            {course.rating}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0 mt-auto bg-slate-800">
        <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {course.price === 0 ? <span className="text-xs text-blue-400">Incluido en suscripción</span> : `$${course.price}`}
          </span>
          <button className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
            Inscribirse
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
