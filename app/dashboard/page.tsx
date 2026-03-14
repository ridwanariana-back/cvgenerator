import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  updateProfile, 
  addExperience, 
  deleteExperience, 
  addEducation, 
  deleteEducation, 
  addSkill, 
  deleteSkill 
} from './actions';
import DashboardContent from '@/components/DashboardContent';
import AvatarUpload from '@/components/AvatarUpload';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Fetch data in parallel for maximum speed
  const [
    { data: profile },
    { data: experiences },
    { data: education },
    { data: skills }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('experience').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('skills').select('*').eq('user_id', user.id)
  ]);

  // Dynamic Progress Bar Logic
  const hasProfile = profile?.full_name && profile?.summary ? 25 : 0;
  const hasExperience = (experiences?.length ?? 0) > 0 ? 25 : 0;
  const hasEducation = (education?.length ?? 0) > 0 ? 25 : 0;
  const hasSkills = (skills?.length ?? 0) > 0 ? 25 : 0;
  const totalProgress = hasProfile + hasExperience + hasEducation + hasSkills;

  const statusText = totalProgress === 100 ? "Ready to Apply!" : totalProgress >= 50 ? "Almost Ready" : "Incomplete";

  // --- TAB CONTENT VARIABLES ---

  const ProfileForm = (
    <div className="space-y-8">
      {/* Photo Form */}
      <AvatarUpload 
        avatarUrl={profile?.avatar_url} 
        initialName={profile?.full_name || user.user_metadata.full_name} 
      />

      {/* Personal Info Form */}
      <form action={updateProfile} className="space-y-6 border-t pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
            <input name="full_name" defaultValue={profile?.full_name || user.user_metadata.full_name || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
            <input name="phone" defaultValue={profile?.phone || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Residence Location</label>
          <input name="address" defaultValue={profile?.address || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Profile Summary</label>
          <textarea name="summary" rows={4} defaultValue={profile?.summary || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200/50 uppercase tracking-widest">Save Profile</button>
      </form>
    </div>
  );

  const ExperienceSection = (
    <div className="space-y-6">
      <form action={addExperience} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
        <input name="company" placeholder="Company Name" className="p-3 border rounded-xl" required />
        <input name="position" placeholder="Job Title/Position" className="p-3 border rounded-xl" required />
        <input name="start_date" type="date" className="p-3 border rounded-xl" required />
        <input name="end_date" type="date" className="p-3 border rounded-xl" />
        <textarea name="description" placeholder="Describe your achievements..." className="md:col-span-2 p-3 border rounded-xl" rows={3} />
        <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">+ Add Experience</button>
      </form>
      <div className="grid gap-4">
        {experiences?.map((exp) => (
          <div key={exp.id} className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
            <div>
              <p className="font-black text-gray-800 uppercase text-sm">{exp.position}</p>
              <p className="text-gray-500 text-sm">{exp.company}</p>
              <p className="text-gray-500 text-sm">Achievements : {exp.description}</p>
              <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-tighter">{exp.start_date} — {exp.end_date || 'Present'}</p>
            </div>
            <form action={async () => { 'use server'; await deleteExperience(exp.id); }}>
              <button className="text-red-400 hover:text-red-600 p-2 transition">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );

  const EducationSection = (
    <div className="space-y-6">
      <form action={addEducation} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/30 p-6 rounded-2xl border border-green-100">
        <input name="school" placeholder="Institution Name" className="p-3 border rounded-xl" required />
        <input name="degree" placeholder="Degree (e.g. Bachelor's)" className="p-3 border rounded-xl" required />
        <input name="major" placeholder="Major/Field of Study" className="p-3 border rounded-xl md:col-span-2" required />
        <input name="start_date" type="date" className="p-3 border rounded-xl" required />
        <input name="end_date" type="date" className="p-3 border rounded-xl" />
        <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">+ Add Education</button>
      </form>
      <div className="grid gap-4">
        {education?.map((edu) => (
          <div key={edu.id} className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
            <div>
              <p className="font-black text-gray-800 uppercase text-sm">{edu.school}</p>
              <p className="text-gray-500 text-sm">{edu.degree} {edu.major}</p>
              <p className="text-[10px] font-bold text-green-600 mt-1 uppercase tracking-tighter">{edu.start_date} - {edu.end_date}</p>
            </div>
            <form action={async () => { 'use server'; await deleteEducation(edu.id); }}>
              <button className="text-red-400 hover:text-red-600 p-2 transition">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );

  const SkillSection = (
    <div className="space-y-6">
      <form action={addSkill} className="flex flex-col md:flex-row gap-3 bg-purple-50/30 p-6 rounded-2xl border border-purple-100">
        <input name="skill_name" placeholder="e.g. React.js, UI Design..." className="flex-1 p-3 border rounded-xl" required />
        <select name="level" className="p-3 border rounded-xl bg-white outline-none">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>
        <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition">Add</button>
      </form>
      <div className="flex flex-wrap gap-3">
        {skills?.map((skill) => (
          <div key={skill.id} className="group flex items-center bg-white border border-purple-100 pl-4 pr-2 py-2 rounded-full shadow-sm">
            <span className="text-sm font-bold text-gray-700">{skill.skill_name}</span>
            <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full uppercase font-black">{skill.level}</span>
            <form action={async () => { 'use server'; await deleteSkill(skill.id); }}>
              <button className="ml-2 text-gray-300 hover:text-red-500 transition p-1">✕</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
            CV<span className="text-blue-600">GENERATOR.</span>
          </h1>
          <form action="/auth/signout" method="post">
            <button className="text-xs font-bold text-gray-400 hover:text-red-600 transition uppercase tracking-widest">Logout</button>
          </form>
        </div>

        {/* TOP PANEL (Layout 4:6) */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-10">
          <div className="md:col-span-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
            <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-4">Completion Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className={`text-2xl font-black ${totalProgress === 100 ? 'text-green-600' : 'text-gray-800'}`}>{totalProgress}%</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">{statusText}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${totalProgress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z"/></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Generate PDF</h3>
              <p className="text-gray-400 text-sm mt-1">Automatic ATS-standard layouts for professionals.</p>
            </div>
            <Link href="/dashboard/preview" className="relative z-10 mt-8 w-fit bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 text-center shadow-lg shadow-blue-600/30">
              PREVIEW CV NOW →
            </Link>
          </div>
        </div>

        {/* MAIN TABS */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <DashboardContent 
            profileForm={<div key="p-tab" className="p-8">{ProfileForm}</div>}
            experienceSection={<div key="e-tab" className="p-8">{ExperienceSection}</div>}
            educationSection={<div key="ed-tab" className="p-8">{EducationSection}</div>}
            skillsSection={<div key="s-tab" className="p-8">{SkillSection}</div>}
          />
        </div>

      </div>
    </div>
  );
}