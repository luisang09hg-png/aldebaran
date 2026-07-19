import React, { useState, useEffect } from 'react';
import { CourseFilters } from './CourseFilters';
import { CourseCard } from './CourseCard';
import './index.css';

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
    <section className="skills-center-page">
      <header className="skills-center-header">
        <h2>Skills & Courses Center</h2>
        <p>Sube de nivel tus habilidades con nuestros cursos especializados. Encuentra el camino perfecto para impulsar tu carrera tecnológica.</p>
      </header>

      <CourseFilters activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {loading ? (
        <div className="skills-center-empty">Cargando cursos...</div>
      ) : filteredCourses.length > 0 ? (
        <div className="skills-center-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="skills-center-empty">No se encontraron cursos en esta categoría.</div>
      )}
    </section>
  );
};

export default SkillsCenter;
