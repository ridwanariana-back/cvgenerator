import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AvatarUpload from '@/components/AvatarUpload';
import SubmitButton from '@/components/SubmitButton';
import { ActionDeleteButton } from '@/components/FormControls';
import SuccessAlert from '@/components/SuccessAlert';
import DashboardContent from '@/components/DashboardContent'; // Import kembali tab system
import { updateProfile, addExperience, addEducation, addSkill,deleteExperience,handleSignOut,deleteEducation,deleteSkill } from './actions';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const resolvedParams = await searchParams;
const isUpdated = resolvedParams.status === 'success';

  // Fetch Data
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: experiences } = await supabase.from('experience').select('*').eq('user_id', user.id).order('start_date', { ascending: false });
  const { data: education } = await supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false });
  const { data: skills } = await supabase.from('skills').select('*').eq('user_id', user.id);

  // Hitung Progress (Contoh sederhana)
  const stats = [
    { label: 'Profile', value: profile?.full_name ? 25 : 0 },
    { label: 'Experience', value: (experiences?.length || 0) > 0 ? 25 : 0 },
    { label: 'Education', value: (education?.length || 0) > 0 ? 25 : 0 },
    { label: 'Skills', value: (skills?.length || 0) > 0 ? 25 : 0 },
  ];
  const progress = stats.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 mb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Edit Profile</h1>
    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Manage your professional identity</p>
  </div>
  
  <div className="flex items-center gap-3 w-full md:w-auto">
    <a 
      href="/dashboard/preview" 
      className="flex-1 md:flex-none text-center bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
    >
      View Preview →
    </a>
    
    {/* Tombol Logout */}
    <form action={handleSignOut}>
  <SubmitButton 
    label="LOGOUT" 
    loadingLabel="EXITING..." 
    className="bg-red-50 text-red-600 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 shadow-sm" 
  />
</form>
  </div>
</header>

      {/* PROGRESS BAR */}
      <div className="bg-gray-100 h-4 w-full rounded-full overflow-hidden border border-gray-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter px-1">
        <span>Profile Completion</span>
        <span className="text-blue-600">{progress}% Complete</span>
      </div>

    {isUpdated && <SuccessAlert />}

      <AvatarUpload 
        avatarUrl={profile?.avatar_url} 
        initialName={profile?.full_name || user.user_metadata.full_name} 
      />

      {/* DASHBOARD CONTENT DENGAN TABS */}
      <DashboardContent 
        profileForm={
          <form action={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Full Name</label>
                <input name="full_name" placeholder="e.g. Ridwan Ariana" defaultValue={profile?.full_name || ''} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Phone Number</label>
                <input name="phone" placeholder="e.g. +62..." defaultValue={profile?.phone || ''} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Residence Location</label>
              <input name="address" placeholder="e.g. Jakarta, Indonesia" defaultValue={profile?.address || ''} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Profile Summary</label>
              <textarea name="summary" rows={4} placeholder="Tell about your professional background..." defaultValue={profile?.summary || ''} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
            </div>
            <SubmitButton label="SAVE PROFILE" loadingLabel="SAVING..." className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-colors" />
          </form>
        }
        experienceSection={
          <div className="space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-blue-600">Work Experience</h2>
            <form action={addExperience} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-blue-600 ml-1">Company Name</label>
                <input name="company" placeholder="Google, etc" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-blue-600 ml-1">Job Title</label>
                <input name="position" placeholder="Frontend Developer" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-blue-600 ml-1">Start Date</label>
                <input name="start_date" type="date" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-blue-600 ml-1">End Date</label>
                <input name="end_date" type="date" className="w-full p-3 border rounded-xl text-sm" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-blue-600 ml-1">Achievements / Description</label>
                <textarea name="description" placeholder="Describe your impact..." className="w-full p-3 border rounded-xl text-sm" rows={3} />
              </div>
              <SubmitButton label="+ ADD EXPERIENCE" loadingLabel="ADDING..." className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold" />
            </form>
            {/* LIST DATA PENGALAMAN */}
      <div className="space-y-4">
        {experiences?.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm">
            <div>
              <h4 className="font-bold text-sm uppercase">{exp.position}</h4>
              <p className="text-xs text-gray-500">{exp.company} • {exp.start_date} - {exp.end_date || 'Present'}</p>
              <p className="text-md text-black-500">Job Achievement / Description : <br></br>{exp.description}</p>
            </div>
            <ActionDeleteButton id={exp.id} action={deleteExperience} /> 
          </div>
        ))}
      </div>
          </div>
        }
        educationSection={
          <div className="space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-green-700">Education</h2>
            <form action={addEducation} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/30 p-6 rounded-2xl border border-green-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-green-700 ml-1">Institution</label>
                <input name="school" placeholder="University of..." className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-green-700 ml-1">Degree</label>
                <input name="degree" placeholder="Bachelor's Degree" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-green-700 ml-1">Major</label>
                <input name="major" placeholder="Computer Science" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-green-700 ml-1">Start Date</label>
                <input name="start_date" type="date" className="w-full p-3 border rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-green-700 ml-1">End Date</label>
                <input name="end_date" type="date" className="w-full p-3 border rounded-xl text-sm" />
              </div>
              <SubmitButton label="+ ADD EDUCATION" loadingLabel="ADDING..." className="md:col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold" />
            </form>
            {/* LIST DATA PENDIDIKAN */}
      <div className="space-y-4">
        {education?.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm">
            <div>
              <h4 className="font-bold text-sm uppercase">{edu.school}</h4>
              <p className="text-xs text-gray-500">{edu.degree} - {edu.major}</p>
              <p className="text-xs text-gray-500">{edu.start_date} - {edu.end_date}</p>
            </div>
            <ActionDeleteButton id={edu.id} action={deleteEducation} />
          </div>
        ))}
      </div>
          </div>
        }
        skillsSection={
          <div className="space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-purple-700">Skills</h2>
            <form action={addSkill} className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100">
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-purple-700 ml-1">Skill Name</label>
                  <input name="skill_name" placeholder="React.js, Tailwind, etc..." className="w-full p-3 border rounded-xl text-sm" required />
                </div>
                <div className="w-full md:w-48 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-purple-700 ml-1">Level</label>
                  <select name="level" className="w-full p-3 border rounded-xl bg-white outline-none text-sm font-medium">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
                <SubmitButton label="ADD" loadingLabel="..." className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold h-[46px]" />
              </div>
            </form>
      {/* LIST DATA SKILL */}
<div className="flex flex-wrap gap-2">
  {skills?.map((skill) => (
    <div key={skill.id} className="px-4 py-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-bold flex items-center gap-3 shadow-sm">
      <span>{skill.skill_name} — <span className="opacity-60">{skill.level}</span></span>
      
      {/* Gunakan ActionDeleteButton agar tidak error onClick */}
      <ActionDeleteButton 
        id={skill.id} 
        action={deleteSkill} 
      />
    </div>
  ))}
</div>
          </div>
        }
      />
    </div>
  );
}