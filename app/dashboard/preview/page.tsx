import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

const formatDate = (dateString: string) => {
  if (!dateString) return 'Present'; // Berubah dari 'Sekarang'
  return new Date(dateString).toLocaleDateString('en-US', { // Berubah ke en-US
    year: 'numeric',
    month: 'long',
  });
};

export default async function PreviewCVPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const selectedTemplate = resolvedParams.template || 'modern';

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const [profile, experiences, education, skills] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('experience').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('skills').select('*').eq('user_id', user.id),
  ]);

  const data = { 
    profile: profile.data, 
    experiences: experiences.data || [], 
    education: education.data || [], 
    skills: skills.data || [] 
  };

  return (
    <div className="flex h-screen bg-[#121212] overflow-hidden font-sans">
      {/* NAVIGATION SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col no-print shrink-0 z-10 text-gray-900">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">← Dashboard</Link>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">CV Templates</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {[
            { id: 'modern', name: 'Modern Professional' },
            { id: 'minimalist', name: 'Minimalist Clean' }
          ].map((t) => (
            <Link 
              key={t.id} 
              href={`?template=${t.id}`} 
              className={`block p-4 rounded-xl border-2 transition-all ${
                selectedTemplate === t.id ? 'border-blue-600 bg-white shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-widest">{t.name}</p>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t bg-white">
          <PrintButton fullName={data.profile?.full_name || 'user'} template={selectedTemplate} />
        </div>
      </aside>

      {/* PREVIEW AREA */}
      <main className="flex-1 overflow-y-auto p-12 flex justify-center bg-[#1a1a1a] scrollbar-hide print:p-0 print:bg-white">
        
        <div id="cv-content" className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[210mm] min-h-[297mm] shrink-0 box-border print:shadow-none print:m-0 print:w-[210mm]">
          
          {/* 1. TEMPLATE: MODERN */}
          {selectedTemplate === 'modern' && (
            <div className="p-[20mm] text-gray-900">
              <header className="flex justify-between items-center border-b-4 border-gray-900 pb-8 mb-10">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">{data.profile?.full_name}</h1>
                  <p className="text-[11px] mt-2 text-gray-500 font-bold tracking-tight uppercase">
                    {data.profile?.phone} • {user.email} • {data.profile?.address}
                  </p>
                </div>
                {data.profile?.avatar_url && (
                  <img src={data.profile.avatar_url} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-900 aspect-square" alt="Profile" />
                )}
              </header>

              <section className="mb-10 text-justify">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 bg-gray-100 p-1 px-2 inline-block">About Me</h2>
                <p className="text-sm leading-relaxed italic font-serif">"{data.profile?.summary}"</p>
              </section>

              <div className="grid grid-cols-3 gap-12">
                <div className="col-span-2 space-y-10">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-gray-900 pb-2">Work Experience</h2>
                  {data.experiences.map((exp: any) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                      <div className="flex justify-between font-bold text-sm uppercase mb-1">
                        <h3>{exp.position}</h3>
                        <span className="text-[10px] font-normal text-gray-400">{formatDate(exp.start_date)} - {formatDate(exp.end_date)}</span>
                      </div>
                      <p className="text-blue-600 text-[11px] font-black mb-3 tracking-widest uppercase">{exp.company}</p>
                      <p className="text-xs text-gray-600 leading-relaxed text-justify">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-10">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-gray-900 pb-2 mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((s: any) => (
                        <span key={s.id} className="text-[10px] bg-gray-900 text-white px-2 py-1 font-bold uppercase tracking-tighter">{s.skill_name} - {s.level}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-gray-900 pb-2 mb-4">Education</h2>
                    {data.education.map((edu: any) => (
                      <div key={edu.id} className="mb-4 text-xs">
                        <p className="font-bold uppercase leading-tight">{edu.school}</p>
                        <p className="italic text-gray-400 mt-1 uppercase text-[9px] tracking-tighter">{edu.degree} {edu.major}</p>
                        <p className="text-gray-400 mt-1 uppercase text-[9px] tracking-tighter">{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TEMPLATE: MINIMALIST */}
          {selectedTemplate === 'minimalist' && (
            <div className="p-[25mm] text-gray-900 h-full">
              <div className="text-center border-b-2 border-gray-100 pb-12 mb-12">
                <h1 className="text-5xl font-serif mb-4 uppercase tracking-tighter italic">{data.profile?.full_name}</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">
                  {data.profile?.phone} / {user.email} / {data.profile?.address}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-16">
                <aside className="space-y-12 pr-6 border-r border-gray-50">
                  <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">About Me</h2>
                    <p className="text-xs text-gray-500 italic leading-relaxed text-justify font-serif">"{data.profile?.summary}"</p>
                  </section>
                  <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Education</h2>
                    {data.education.map((edu: any) => (
                      <div key={edu.id} className="mb-4">
                        <p className="text-[11px] font-bold uppercase leading-tight">{edu.school}</p>
                        <p className="text-[10px] text-gray-400 italic mt-1">{edu.degree} {edu.major}</p>
                        <p className="text-[10px] text-gray-400 italic mt-1">{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</p>
                      </div>
                    ))}
                  </section>
                  <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Skills</h2>
                    <div className="space-y-3">
                      {data.skills.map((s: any) => (
                        <div key={s.id} className="flex justify-between text-[10px] uppercase border-b border-gray-50 pb-1 tracking-tight">
                          <span>{s.skill_name}</span>
                          <span className="text-gray-300 font-bold">{s.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </aside>

                <main className="col-span-2 space-y-12">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">Work Experience</h2>
                  {data.experiences.map((exp: any) => (
                    <div key={exp.id} className="mb-10">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-base font-bold uppercase tracking-tight">{exp.position}</h3>
                        <span className="text-[9px] text-gray-400 uppercase">{formatDate(exp.start_date)} - {formatDate(exp.end_date)}</span>
                      </div>
                      <p className="text-[10px] text-blue-600 font-black mb-3 tracking-widest uppercase">{exp.company}</p>
                      <p className="text-xs text-gray-500 leading-relaxed text-justify font-serif italic italic">"{exp.description}"</p>
                    </div>
                  ))}
                </main>
              </div>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, aside, button, nav, .sidebar-nav { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          html, body { height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; background: white !important; }
          main { display: block !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; background: white !important; }
          #cv-content { display: block !important; box-shadow: none !important; width: 210mm !important; min-height: 297mm !important; border: none !important; margin: 0 auto !important; }
          .grid { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 1.5rem !important; }
          aside { display: block !important; }
          ::-webkit-scrollbar { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}} />
    </div>
  );
}