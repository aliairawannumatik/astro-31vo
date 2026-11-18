import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN NOTASI PANGKAT", path: "/lkpd/bilangan-berpangkat/pengertian-notasi", icon: "📝" },
  { label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "/lkpd/bilangan-berpangkat/sifat-operasi", icon: "⚡" },
  { label: "BENTUK AKAR", path: "/lkpd/bilangan-berpangkat/bentuk-akar", icon: "🌱" },
  { label: "MERASIONALKAN BENTUK AKAR", path: "/lkpd/bilangan-berpangkat/merasionalkan-akar", icon: "🔁" },
  { label: "NOTASI ILMIAH", path: "/lkpd/bilangan-berpangkat/notasi-ilmiah", icon: "🔬" },
];

const BilanganBerpangkatMenuPage = () => (
  <MateriTopicPage
    title="LKPD BILANGAN BERPANGKAT"
    emoji="⚡"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default BilanganBerpangkatMenuPage;
