'use client';

import { uploadAvatar, deleteAvatar } from '@/app/dashboard/actions';
import { useState, useTransition } from 'react';

export default function AvatarUpload({ avatarUrl, initialName }: { avatarUrl?: string, initialName?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Maximum 5MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    startTransition(async () => {
      try {
        await uploadAvatar(formData);
      } catch (error) {
        alert("Failed to upload photo.");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your profile picture?")) {
      startTransition(async () => {
        try {
          await deleteAvatar();
        } catch (error) {
          alert("Failed to delete photo.");
        }
      });
    }
  };

  return (
    <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
      <div className="shrink-0 relative">
        {isPending ? (
          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : avatarUrl ? (
          <>
            <img className="h-20 w-20 object-cover rounded-full ring-2 ring-blue-500" src={avatarUrl} alt="Avatar" />
            <button
              onClick={handleDelete}
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all shadow-lg"
              title="Hapus Foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-2xl uppercase">
            {initialName?.charAt(0) || 'U'}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <label className="block">
          <span className="sr-only">Select Profile Photo</span>
          <input 
            type="file" 
            name="avatar"
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
            accept="image/*"
            disabled={isPending}
          />
        </label>
        <p className="mt-1 text-xs text-gray-400">
          {isPending ? "Uploading..." : "PNG, JPG atau GIF (Maks. 5MB)"}
        </p>
      </div>
    </div>
  );
}