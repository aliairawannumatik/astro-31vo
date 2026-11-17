import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "DEFINISI KESEBANGUNAN DAN KEKONGRUENAN", path: "/numatik-gamez/kesebangunan-kekongruenan/definisi" },
  { name: "MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN", path: "/numatik-gamez/kesebangunan-kekongruenan/menghitung-rusuk" },
  { name: "SEGITIGA – SEGITIGA YANG SEBANGUN", path: "/numatik-gamez/kesebangunan-kekongruenan/segitiga-sebangun" },
  { name: "RASIO RUSUK SEGITIGA SIKU-SIKU DENGAN KONSEP KESEBANGUNAN", path: "/numatik-gamez/kesebangunan-kekongruenan/rasio-rusuk" },
  { name: "KEKONGRUENAN PADA BANGUN DATAR", path: "/numatik-gamez/kesebangunan-kekongruenan/kekongruenan-bangun-datar" },
];

const KesebangunanKekongruenPage = () => (
  <GameSubtopicPage
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="📐"
    kelasLabel="Kelas 9"
  />
);

export default KesebangunanKekongruenPage;
