import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface TeamMembersProps {
  members: TeamMember[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ members }) => {
  return (
    <section className="py-10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Nuestros Expertos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={member.image}
                alt={member.name}
                width={320}
                height={320}
                className="object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <p className="text-gray-700">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
