import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR LINGKARAN", path: "/lkpd/lingkaran/lkpd", icon: "⭕" },
  { label: "KELILING DAN LUAS LINGKARAN", path: "/lkpd/lingkaran/lkpd", icon: "📏" },
  { label: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "/lkpd/lingkaran/lkpd", icon: "🔗" },
  { label: "PANJANG BUSUR DAN LUAS JURING", path: "/lkpd/lingkaran/lkpd", icon: "🥧" },
  { label: "SUDUT PUSAT DAN SUDUT KELILING", path: "/lkpd/lingkaran/lkpd", icon: "📐" },
  { label: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "/lkpd/lingkaran/lkpd", icon: "🏗️" },
];

const LingkaranMenuPage = () => (
  <MateriTopicPage
    title="LKPD LINGKARAN"
    emoji="⭕"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default LingkaranMenuPage;
