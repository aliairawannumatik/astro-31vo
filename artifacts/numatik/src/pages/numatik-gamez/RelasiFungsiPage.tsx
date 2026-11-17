import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN RELASI DAN PENYAJIANNYA", path: "/numatik-gamez/relasi-dan-fungsi/pengertian-relasi" },
  { name: "PENGERTIAN FUNGSI DAN PENYAJIANNYA", path: "/numatik-gamez/relasi-dan-fungsi/pengertian-fungsi" },
  { name: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU", path: "/numatik-gamez/relasi-dan-fungsi/banyak-fungsi" },
  { name: "NOTASI DAN RUMUS FUNGSI", path: "/numatik-gamez/relasi-dan-fungsi/notasi-rumus" },
  { name: "GRAFIK FUNGSI (PENGAYAAN)", path: "/numatik-gamez/relasi-dan-fungsi/grafik-fungsi" },
];

const RelasiFungsiPage = () => (
  <GameSubtopicPage
    title="RELASI DAN FUNGSI"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="📊"
    kelasLabel="Kelas 8"
  />
);

export default RelasiFungsiPage;
