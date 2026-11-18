import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "HUBUNGAN 2 GARIS", path: "/lkpd/garis-dan-sudut/lkpd", icon: "↔️" },
  { label: "SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG", path: "/lkpd/garis-dan-sudut/lkpd", icon: "📐" },
  { label: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/lkpd/garis-dan-sudut/lkpd", icon: "📏" },
  { label: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/lkpd/garis-dan-sudut/lkpd", icon: "🔺" },
];

const GarisDanSudutMenuPage = () => (
  <MateriTopicPage
    title="LKPD GARIS DAN SUDUT"
    emoji="📐"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default GarisDanSudutMenuPage;
