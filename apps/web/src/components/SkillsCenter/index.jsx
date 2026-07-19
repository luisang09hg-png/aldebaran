import React, { useState } from 'react';
import { CourseFilters } from './CourseFilters';
import { CourseCard } from './CourseCard';

// Mock data para previsualizar la UI
const MOCK_COURSES = [
  {
    id: 1,
    title: 'React avanzado y Patrones de Diseño',
    category: 'Desarrollo Web',
    level: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: { name: 'Elena Gómez', avatar: 'https://i.pravatar.cc/150?u=1' },
    duration: 12,
    modules: 8,
    rating: 4.9,
    price: 0 // Incluido
  },
  {
    id: 2,
    title: 'Fundamentos de UI/UX para Developers',
    category: 'Diseño UI/UX',
    level: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: { name: 'Carlos Díaz', avatar: 'https://i.pravatar.cc/150?u=2' },
    duration: 5,
    modules: 4,
    rating: 4.8,
    price: 29
  },
  {
    id: 3,
    title: 'Machine Learning con Python y TensorFlow',
    category: 'Data Science',
    level: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=3' },
    duration: 20,
    modules: 12,
    rating: 5.0,
    price: 49
  },
  {
    id: 4,
    title: 'Next.js 14 App Router al Máximo',
    category: 'Desarrollo Web',
    level: 'Avanzado',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: { name: 'Juan Pérez', avatar: 'https://i.pravatar.cc/150?u=4' },
    duration: 15,
    modules: 10,
    rating: 4.7,
    price: 0
  }
];

export const SkillsCenter = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredCourses = activeCategory === 'Todos' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.category === activeCategory);

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

        {filteredCourses.length > 0 ? (
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
