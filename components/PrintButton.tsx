'use client';

export default function PrintButton({ fullName, template }: { fullName: string; template: string }) {
  const handleDownload = () => {
    // 1. Simpan judul asli
    const originalTitle = document.title;
    
    // 2. Ubah judul menjadi format yang kamu mau (misal: budi-modern-cv)
    const formattedName = fullName.toLowerCase().replace(/\s+/g, '-');
    document.title = `${formattedName}-${template}-cv`;

    // 3. Jalankan print
    window.print();

    // 4. Kembalikan judul asli setelah dialog print tertutup
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
    >
      Download PDF
    </button>
  );
}