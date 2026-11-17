import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGANTAR STATISTIKA, PENGUMPULAN DATA DAN PENYAJIAN DATA", path: "/numatik-gamez/statistika/pengantar" },
  { name: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/numatik-gamez/statistika/rata-rata" },
  { name: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/numatik-gamez/statistika/median-modus" },
  { name: "UKURAN LETAK DATA (KUARTIL)", path: "/numatik-gamez/statistika/kuartil" },
  { name: "UKURAN PENYEBARAN DATA (JANGKAUAN, JIK, SIMPANGAN KUARTIL)", path: "/numatik-gamez/statistika/penyebaran-data" },
];

const StatistikaPage = () => (
  <GameSubtopicPage
    title="STATISTIKA"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="📊"
    kelasLabel="Kelas 9"
  />
);

export default StatistikaPage;
