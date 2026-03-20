'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Menu, X, ChevronLeft, Download } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// --- STYLES UNTUK PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff', fontFamily: 'Helvetica' },
  // Menambahkan paddingBottom pada headerContainer agar garis tidak menempel foto di PDF
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: 1, borderBottomColor: '#000', pb: 10, mb: 10 }, 
  headerText: { flex: 1 },
  name: { fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
  contactInfo: { fontSize: 9, marginTop: 8, color: '#333' },
  avatar: { width: 60, height: 60, borderRadius: 4, objectFit: 'cover', marginLeft: 15,marginBottom: 15 },
  sectionHeader: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    backgroundColor: '#eeeeee', 
    padding: 5, 
    marginTop: 15, 
    marginBottom: 10, 
    textTransform: 'uppercase' 
  },
  itemTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 5 },
  content: { fontSize: 9, color: '#555', lineHeight: 1.4 },
  contentabout: { fontSize: 11, color: '#333', lineHeight: 1.4 },
  contentskill: { fontSize: 9, color: '#333',fontWeight: 'bold', lineHeight: 1.4 },
});

// --- KOMPONEN DOKUMEN PDF ---
const MyPDFDocument = ({ data, user }: any) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.headerContainer}>
        <View style={pdfStyles.headerText}>
          <Text style={pdfStyles.name}>{data.profile?.full_name}</Text>
          <Text style={pdfStyles.contactInfo}>
            {data.profile?.phone}   |   {user?.email}   |   {data.profile?.address}
          </Text>
        </View>
        {data.profile?.avatar_url && (
          <Image src={data.profile.avatar_url} style={pdfStyles.avatar} />
        )}
      </View>

      <Text style={pdfStyles.sectionHeader}>About Me</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={pdfStyles.contentabout}>" {data.profile.summary} "</Text>
        </View>
      
      <Text style={pdfStyles.sectionHeader}>Experience</Text>
      {data.experiences?.map((exp: any) => (
        <View key={exp.id} style={{ marginBottom: 10 }}>
          <Text style={pdfStyles.itemTitle}>- {exp.position} - {exp.company}</Text>
          <Text style={pdfStyles.content}>{exp.description}</Text>
        </View>
      ))}

      <Text style={pdfStyles.sectionHeader}>Skills</Text>
      <Text style={pdfStyles.contentskill}>
        {data.skills.map((s: any) => `${s.skill_name} - ${s.level}`).join(', ')}
      </Text>

      {data.education?.length > 0 && (
        <>
          <Text style={pdfStyles.sectionHeader}>Education</Text>
          {data.education.map((edu: any) => (
            <View key={edu.id} style={{ marginBottom: 5 }}>
              <ul>
              <li>  
              <Text style={pdfStyles.itemTitle}>- {edu.school}, {edu.degree} - {edu.major}</Text>
              <Text style={pdfStyles.content}>{edu.start_date} - {edu.end_date}</Text>
              </li>  
              </ul>
            </View>
          ))}
        </>
      )}
    </Page>
  </Document>
);

export default function PreviewCVPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const selectedTemplate = searchParams.get('template') || 'modern';

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const [profile, experiences, education, skills] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', authUser.id).single(),
          supabase.from('experience').select('*').eq('user_id', authUser.id).order('start_date', { ascending: false }),
          supabase.from('education').select('*').eq('user_id', authUser.id).order('start_date', { ascending: false }),
          supabase.from('skills').select('*').eq('user_id', authUser.id),
        ]);
        setData({ profile: profile.data, experiences: experiences.data || [], education: education.data || [], skills: skills.data || [] });
      }
    };
    fetchData();
  }, [supabase]);

  if (!data) return <div className="h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#111] overflow-hidden font-sans">
      
      <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-6 left-6 z-[60] bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
        <Menu size={20} className="text-black" />
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[70] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[80] w-72 bg-white transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <Link href="/dashboard" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
              <ChevronLeft size={14} /> Dashboard
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400"><X size={20}/></button>
          </div>
          <h2 className="text-xl font-black uppercase italic mb-8 text-gray-900">Templates</h2>
          <nav className="flex-1 space-y-2">
            {['modern'].map((t) => (
              <Link key={t} href={`?template=${t}`} onClick={() => setIsSidebarOpen(false)} className={`block p-4 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${selectedTemplate === t ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}>
                {t} Style
              </Link>
            ))}
          </nav>
          <div className="pt-8 border-t">
            <PDFDownloadLink
              document={<MyPDFDocument data={data} user={user} />}
              fileName={`${data.profile?.full_name || 'CV'}.pdf`}
              className="w-full bg-black text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 shadow-xl transition-all"
            >
              {({ loading }) => (loading ? 'PREPARING...' : <><Download size={16}/> DOWNLOAD PDF</>)}
            </PDFDownloadLink>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#0a0a0a] flex justify-center items-start p-6 md:p-12">
        <div className="py-10 md:py-0">
          <div className="bg-white shadow-[0_0_60px_rgba(0,0,0,0.6)] w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] origin-top transition-all duration-500 scale-[0.38] sm:scale-[0.55] md:scale-[0.8] lg:scale-[0.9] xl:scale-[1.0]">
            
            {selectedTemplate === 'modern' ? (
              <div className="text-gray-900 font-sans">
                {/* Header dengan Nama dan Gambar. Menambahkan pb-6 agar garis hitam turun sedikit di Preview */}
                <div className="flex justify-between items-start border-b border-black pb-6 mb-8">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{data.profile?.full_name}</h1>
                    <p className="text-[11px] font-medium text-gray-600">
                      {data.profile?.phone} &nbsp; | &nbsp; {user?.email} &nbsp; | &nbsp; {data.profile?.address}
                    </p>
                  </div>
                  {data.profile?.avatar_url && (
                    <img src={data.profile.avatar_url} className="w-20 h-20 object-cover rounded-md ml-4" alt="Profile" />
                  )}
                </div>
                
                <section className="mb-8">
                  <h2 className="bg-[#eeeeee] px-3 py-1.5 text-[11px] font-bold uppercase mb-4">About Me</h2>
                  <div className="space-y-6">
                      <div>
                        <p className="text-[12px] text-black-600 mt-1 leading-relaxed">" {data.profile.summary} "</p>
                      </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="bg-[#eeeeee] px-3 py-1.5 text-[11px] font-bold uppercase mb-4">Experience</h2>
                  <div className="space-y-6">
                    {data.experiences.map((exp: any) => (
                      <div key={exp.id}>
                        <h3 className="text-sm font-bold">- {exp.position} - {exp.company}</h3>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="bg-[#eeeeee] px-3 py-1.5 text-[11px] font-bold uppercase mb-4">Skills</h2>
                  <p className="text-[11px] text-gray-800 font-bold tracking-wide">
                    {data.skills.map((s: any) => `${s.skill_name} - ${s.level}`).join(', ')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="bg-[#eeeeee] px-3 py-1.5 text-[11px] font-bold uppercase mb-4">Education</h2>
                  <div className="space-y-6">
                    {data.education.map((edu: any) => (
                      <div key={edu.id}>
                        <h3 className="text-sm font-bold uppercase">- {edu.school}, {edu.degree} - {edu.major}</h3>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{edu.start_date} - {edu.end_date}</p>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            ) : (
              <div className="text-gray-800 font-serif">
                <div className="text-center border-b pb-8 mb-8">
                  <h1 className="text-3xl uppercase tracking-widest">{data.profile?.full_name}</h1>
                  <p className="text-[10px] italic mt-2">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}