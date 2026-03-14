'use client'

export default function MinimalistLayout({ data }: { data: any }) {
  const { profile, experiences, education, skills, user } = data;
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Sekarang';

  return (
    <div className="bg-white w-full">
      <div className="text-center border-b pb-10 mb-10">
        <h1 className="text-5xl font-serif text-gray-900 mb-4">{profile?.full_name}</h1>
        <div className="flex justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          <span>{profile?.phone}</span><span>{user.email}</span><span>{profile?.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12">
        <aside className="col-span-1 space-y-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Profil</h2>
            <p className="text-sm text-gray-600 leading-relaxed italic">"{profile?.summary}"</p>
          </section>
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Keahlian</h2>
            <ul className="space-y-2 text-sm text-gray-700 italic">
              {skills.map((s: any) => (
                <li key={s.id} className="flex justify-between border-b border-gray-50 pb-1">
                  <span>{s.skill_name}</span><span className="text-gray-300">{s.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <main className="col-span-2 space-y-10 border-l pl-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Pengalaman</h2>
            {experiences.map((exp: any) => (
              <div key={exp.id} className="mb-8">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[10px] text-gray-400">{formatDate(exp.start_date)}</span>
                </div>
                <p className="text-sm text-blue-600 font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">{exp.description}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Pendidikan</h2>
            {education.map((e: any) => (
              <div key={e.id} className="mb-4 text-sm">
                <p className="font-bold">{e.school}</p>
                <p className="text-gray-600">{e.degree} {e.major}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}