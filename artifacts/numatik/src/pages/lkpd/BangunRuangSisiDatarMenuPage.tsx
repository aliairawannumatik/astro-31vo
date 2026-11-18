import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KUBUS", path: "/lkpd/bangun-ruang-sisi-datar/kubus", icon: "🎲" },
  { label: "BALOK", path: "/lkpd/bangun-ruang-sisi-datar/balok", icon: "📦" },
  { label: "PRISMA", path: "/lkpd/bangun-ruang-sisi-datar/prisma", icon: "🔷" },
  { label: "LIMAS", path: "/lkpd/bangun-ruang-sisi-datar/limas", icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN", path: "/lkpd/bangun-ruang-sisi-datar/gabungan", icon: "🔗" },
];

const BangunRuangSisiDatarMenuPage = () => (
  <MateriTopicPage
    title="LKPD BANGUN RUANG SISI DATAR"
    emoji="📦"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default BangunRuangSisiDatarMenuPage;
