import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BUKU ANIMASI: PERSAMAAN GARIS LURUS", path: "/lkpd/persamaan-garis-lurus/buku-animasi", icon: "🎬" },
  { label: "GRAFIK PERSAMAAN GARIS LURUS", path: "/lkpd/persamaan-garis-lurus/lkpd", icon: "📈" },
  { label: "GRADIEN (KEMIRINGAN GARIS)", path: "/lkpd/persamaan-garis-lurus/gradien", icon: "📐" },
  { label: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/lkpd/persamaan-garis-lurus/menentukan-pgl", icon: "✏️" },
  { label: "HUBUNGAN 2 GARIS", path: "/lkpd/persamaan-garis-lurus/hubungan-2-garis", icon: "↔️" },
  { label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/lkpd/persamaan-garis-lurus/aplikasi-kontekstual", icon: "🏗️" },
];

const PersamaanGarisLurusMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN GARIS LURUS"
    emoji="📈"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default PersamaanGarisLurusMenuPage;
