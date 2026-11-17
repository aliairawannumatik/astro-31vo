import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "KUBUS", path: "/numatik-gamez/bangun-ruang-sisi-datar/kubus-game" },
  { name: "BALOK", path: "/numatik-gamez/bangun-ruang-sisi-datar/balok-game" },
  { name: "PRISMA", path: "/numatik-gamez/bangun-ruang-sisi-datar/prisma-game" },
  { name: "LIMAS", path: "/numatik-gamez/bangun-ruang-sisi-datar/limas-game" },
  { name: "BANGUN RUANG SISI DATAR GABUNGAN", path: "/numatik-gamez/bangun-ruang-sisi-datar/gabungan-game" },
];

const BangunRuangSisiDatarPage = () => (
  <GameSubtopicPage
    title="BANGUN RUANG SISI DATAR"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="🧊"
    kelasLabel="Kelas 8"
  />
);

export default BangunRuangSisiDatarPage;
