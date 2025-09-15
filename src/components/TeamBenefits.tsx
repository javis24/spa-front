import React from 'react';

const leftItems = [
  {
    title: 'NATURALLY SPA',
    icon: '💆‍♀️',
    description: 'Especialista en tratamientos faciales y cuidado de la piel.',
  },
  {
    title: 'HERBAL & NATURAL',
    icon: '🌿',
    description: 'Expertos en masajes relajantes y terapéuticos.',
  },
  {
    title: 'EFFECTIVE TREATMENTS',
    icon: '💊',
    description: 'Especialista en tratamientos de belleza y cuidado corporal.',
  },
];

const rightItems = [
  {
    title: 'STEAM BATH',
    icon: '🛁',
    description: 'Ambiente relajante y cálido para tu piel.',
  },
  {
    title: 'TRAINED PROFESSIONALS',
    icon: '🧘‍♂️',
    description: 'Equipo certificado y con experiencia.',
  },
  {
    title: 'COMPLETE DETOXIFICATION',
    icon: '🧼',
    description: 'Eliminamos toxinas y revitalizamos tu cuerpo.',
  },
];

const TeamBenefits = () => {
  return (
    <section className="py-16 px-6 text-center bg-white">
      <h2 className="text-3xl font-bold mb-2">
        <span className="text-gray-700">Good </span>
        <span className="text-pink-600">for your health</span>
      </h2>
      <p className="max-w-xl mx-auto text-gray-600 mb-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit elit turpis, a
        porttitor tellus sollicitudin at.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 items-end text-right">
          {leftItems.map((item, idx) => (
            <div key={idx} className="max-w-xs">
              <div className="text-2xl">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Imagen central */}
        <div className="flex justify-center">
          <img
            src="/img/silluet_logo.png"
            alt="Especialista"
            className="rounded-full object-cover w-72 h-72 shadow-md"
          />
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6 items-start text-left">
          {rightItems.map((item, idx) => (
            <div key={idx} className="max-w-xs">
              <div className="text-2xl">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamBenefits;
