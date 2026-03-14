'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User tidak ditemukan')

  const updateData = {
    id: user.id,
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    summary: formData.get('summary') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
  .from('profiles') // <--- Tentukan nama tabelnya dulu
  .upsert(updateData)

  if (error) throw error
  
  // Refresh data di halaman dashboard agar muncul data terbaru
  revalidatePath('/dashboard')
}

export async function addExperience(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const newExperience = {
    user_id: user.id,
    company: formData.get('company') as string,
    position: formData.get('position') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    description: formData.get('description') as string,
  }

  const { error } = await supabase.from('experience').insert(newExperience)
  if (error) throw error

  revalidatePath('/dashboard')
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  await supabase.from('experience').delete().eq('id', id)
  revalidatePath('/dashboard')
}

export async function addEducation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const newEdu = {
    user_id: user.id,
    school: formData.get('school') as string,
    degree: formData.get('degree') as string,
    major: formData.get('major') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
  }

  const { error } = await supabase.from('education').insert(newEdu)
  if (error) throw error

  revalidatePath('/dashboard')
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  await supabase.from('education').delete().eq('id', id)
  revalidatePath('/dashboard')
}

export async function addSkill(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('skills').insert({
    user_id: user.id,
    skill_name: formData.get('skill_name') as string,
    level: formData.get('level') as string,
  })
  revalidatePath('/dashboard')
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  await supabase.from('skills').delete().eq('id', id)
  revalidatePath('/dashboard')
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('avatar') as File;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !file || file.size === 0) return;

  // Nama file unik berdasarkan ID user
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/profile.${fileExt}`;

  // 1. Upload ke Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // 2. Ambil URL Public-nya
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // 3. Simpan URL ke tabel profiles
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  revalidatePath('/dashboard');
}

// Tambahkan di dashboard/actions.ts

export async function deleteAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  // 1. Ambil data profil untuk mendapatkan path file
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  if (profile?.avatar_url) {
    // Ambil nama file dari URL (asumsi format standar Supabase Storage)
    const urlParts = profile.avatar_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${user.id}/${fileName}`;

    // 2. Hapus file dari Storage
    await supabase.storage
      .from('avatars')
      .remove([filePath]);
  }

  // 3. Set avatar_url menjadi null di database
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard');
}