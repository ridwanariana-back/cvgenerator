'use client' // <--- Ini yang bikin onClick jadi boleh dipakai

import { deleteExperience } from '@/app/dashboard/actions'

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button 
      onClick={async () => {
        if (confirm('Are you sure you want to delete this experience?')) {
          await deleteExperience(id)
        }
      }}
      className="text-red-400 hover:text-red-600 text-sm"
    >
      Hapus
    </button>
  )
}