'use client'

export default function CreativeLayout({ data }: { data: any }) {
  const { profile, experiences, education, skills, user } = data;
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Sekarang';

  return (
    <div className="flex min-h-[297mm] border-[12px] w-full border-gray-900 bg-white [print-color-adjust:exact]">
      <aside className="w-1/3 bg-gray-900 text-white p-8 [print-color-adjust:exact]">
        <div className="mb-10 text-center">
          {profile?.avatar_url && (
            <img src={profile.avatar_url} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500 mb-4 shadow-xl aspect-square" alt="Profile" />
          )}
          <h2 className="text-xl font-bold tracking-tight uppercase">{profile?.full_name}</h2>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">Web Developer</p>
        </div>
        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 border-b border-gray-700 pb-2">Kontak</h3>
            <ul className="text-[11px] space-y-3 opacity-90">
              <li className="flex flex-col"><span className="text-gray-500 uppercase text-[8px]">Telepon</span> {profile?.phone}</li>
              <li className="flex flex-col"><span className="text-gray-500 uppercase text-[8px]">Email</span> {user.email}</li>
            </ul>
          </section>
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 border-b border-gray-700 pb-2">Keahlian</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any) => (
                <span key={s.id} className="bg-gray-800 text-[9px] px-2 py-1 rounded border border-gray-700 uppercase">{s.skill_name}</span>
              ))}
            </div>
          </section>
        </div>
      </aside>

      <main className="flex-1 p-10 bg-white">
        <section className="mb-10 text-justify">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-4">Profil Profesional</h2>
          <p className="text-gray-700 leading-relaxed text-sm italic">"{profile?.summary}"</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Pengalaman</h2>
          <div className="space-y-8">
            {experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] font-bold text-blue-600 uppercase">{formatDate(exp.start_date)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-2">{exp.company}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}