import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/lkpd/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/lkpd/perbandingan/bertingkat", icon: "📶" },
  { label: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/lkpd/perbandingan/senilai-berbalik", icon: "🔄" },
  { label: "SKALA", path: "/lkpd/perbandingan/skala", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN", path: "/lkpd/perbandingan/campuran", icon: "🔀" },
];

const LKPDPerbandinganPage = () => (
  <MateriTopicPage
    title="LKPD PERBANDINGAN"
    emoji="⚖️"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default LKPDPerbandinganPage;