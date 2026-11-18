import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/lkpd/peluang/ruang-sampel", icon: "🎯" },
  { label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/lkpd/peluang/peluang-empirik", icon: "📊" },
  { label: "PELUANG TEORETIK", path: "/lkpd/peluang/peluang-teoretik", icon: "🎲" },
  { label: "FREKUENSI HARAPAN", path: "/lkpd/peluang/frekuensi-harapan", icon: "📈" },
  { label: "KOMPLEMEN SUATU KEJADIAN", path: "/lkpd/peluang/komplemen", icon: "🔄" },
  { label: "PELUANG KEJADIAN MAJEMUK", path: "/lkpd/peluang/kejadian-majemuk", icon: "🔗" },
];

const PeluangMenuPage = () => (
  <MateriTopicPage
    title="LKPD PELUANG"
    emoji="🎲"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default PeluangMenuPage;
