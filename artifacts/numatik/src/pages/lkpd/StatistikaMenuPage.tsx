import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGANTAR STATISTIKA DAN PENGUMPULAN DATA", path: "/lkpd/statistika/pengantar-statistika", icon: "📚" },
  { label: "PENYAJIAN DATA", path: "/lkpd/statistika/penyajian-data", icon: "📊" },
  { label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/lkpd/statistika/rata-rata", icon: "➕" },
  { label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/lkpd/statistika/median-modus", icon: "🎯" },
  { label: "UKURAN LETAK DATA (KUARTIL)", path: "/lkpd/statistika/kuartil", icon: "📐" },
  { label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)", path: "/lkpd/statistika/jangkauan-simpangan", icon: "📉" },
];

const StatistikaMenuPage = () => (
  <MateriTopicPage
    title="LKPD STATISTIKA"
    emoji="📊"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default StatistikaMenuPage;
