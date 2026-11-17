import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "TABUNG", path: "/numatik-gamez/bangun-ruang-sisi-lengkung/tabung" },
  { name: "KERUCUT", path: "/numatik-gamez/bangun-ruang-sisi-lengkung/kerucut" },
  { name: "BOLA", path: "/numatik-gamez/bangun-ruang-sisi-lengkung/bola" },
  { name: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/numatik-gamez/bangun-ruang-sisi-lengkung/perubahan-luas-volume" },
  { name: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/numatik-gamez/bangun-ruang-sisi-lengkung/gabungan" },
];

const BangunRuangSisiLengkungPage = () => (
  <GameSubtopicPage
    title="BANGUN RUANG SISI LENGKUNG"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="🌐"
    kelasLabel="Kelas 9"
  />
);

export default BangunRuangSisiLengkungPage;
