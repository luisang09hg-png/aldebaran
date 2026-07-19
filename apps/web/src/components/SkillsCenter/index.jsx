import React, { useState, useEffect } from 'react';
import { CourseFilters } from './CourseFilters';
import { CourseCard } from './CourseCard';

export const SkillsCenter = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos que obtenemos los recomendados o todos según la categoría, o usamos un endpoint real
    // Reemplaza esta URL con tu variable de entorno ej. import.meta.env.VITE_API_URL
    fetch('http://localhost:3000/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching courses", err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = activeCategory === 'Todos' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <section className="bg-[#0B0F19] min-h-screen py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Skills & Courses Center
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Sube de nivel tus habilidades con nuestros cursos especializados. Encuentra el camino perfecto para impulsar tu carrera tecnológica.
          </p>
        </header>

        <CourseFilters 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />

        {loading ? (
          <div className="text-center py-20">
            <p className="text-blue-400 text-lg animate-pulse">Cargando cursos...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron cursos en esta categoría.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsCenter;
