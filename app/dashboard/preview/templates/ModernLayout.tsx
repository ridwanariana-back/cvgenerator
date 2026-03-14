'use client'

export default function ModernLayout({ data }: { data: any }) {
  const { profile, experiences, education, skills, user } = data;
  
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Sekarang';

  return (
    <div className="bg-white w-full [print-color-adjust:exact]">
      <header className="flex justify-between items-start border-b-4 border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            {profile?.full_name || user.user_metadata.full_name}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-gray-600 text-sm">
            <span>{profile?.phone}</span><span>•</span><span>{user.email}</span><span>•</span><span>{profile?.address}</span>
          </div>
        </div>
        {profile?.avatar_url && (
          <img src={profile.avatar_url} className="w-32 h-32 rounded-xl object-cover border-2 border-gray-800 shadow-md" alt="Profile" />
        )}
      </header>

      {profile?.summary && (
        <section className="mb-10 text-justify text-gray-700 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-3 italic underline decoration-blue-500 decoration-4 underline-offset-4">Tentang Saya</h2>
          <p>{profile.summary}</p>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">Pengalaman Kerja</h2>
        <div className="space-y-6">
          {experiences.map((exp: any) => (
            <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
              <div className="absolute w-3 h-3 bg-gray-800 rounded-full -left-[7.5px] top-1.5"></div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                <span className="text-sm font-semibold text-gray-500 italic">{formatDate(exp.start_date)} — {formatDate(exp.end_date)}</span>
              </div>
              <p className="font-semibold text-blue-600 mb-2">{exp.company}</p>
              <p className="text-gray-700 text-sm text-justify leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">Pendidikan</h2>
        {education.map((edu: any) => (
          <div key={edu.id} className="mb-4 text-sm flex justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{edu.school}</h3>
              <p className="text-gray-700">{edu.degree} {edu.major}</p>
            </div>
            <span className="text-gray-500 italic">{formatDate(edu.start_date)}</span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">Keahlian</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: any) => (
            <div key={skill.id} className="border border-gray-800 px-3 py-1 rounded-md text-sm font-medium">
              {skill.skill_name} <span className="text-xs text-gray-400">({skill.level})</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}