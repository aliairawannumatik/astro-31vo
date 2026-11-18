import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN RELASI DAN PENYAJIANNYA", path: "/lkpd/relasi-dan-fungsi/lkpd", icon: "🔗" },
  { label: "PENGERTIAN FUNGSI DAN PENYAJIANNYA", path: "/lkpd/relasi-dan-fungsi/lkpd", icon: "📈" },
  { label: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU", path: "/lkpd/relasi-dan-fungsi/lkpd", icon: "🔢" },
  { label: "NOTASI DAN RUMUS FUNGSI", path: "/lkpd/relasi-dan-fungsi/lkpd", icon: "📝" },
  { label: "GRAFIK FUNGSI (PENGAYAAN)", path: "/lkpd/relasi-dan-fungsi/lkpd", icon: "📊" },
];

const RelasiFungsiMenuPage = () => (
  <MateriTopicPage
    title="LKPD RELASI DAN FUNGSI"
    emoji="🔗"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default RelasiFungsiMenuPage;
