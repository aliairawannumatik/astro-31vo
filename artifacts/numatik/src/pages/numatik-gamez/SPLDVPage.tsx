import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/numatik-gamez/spldv/definisi-spldv" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/numatik-gamez/spldv/metode-grafik" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/numatik-gamez/spldv/metode-substitusi" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/numatik-gamez/spldv/metode-eliminasi" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/numatik-gamez/spldv/metode-campuran" },
  { name: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/numatik-gamez/spldv/model-spldv" },
  { name: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/numatik-gamez/spldv/penyelesaian-masalah" },
];

const SPLDVPage = () => (
  <GameSubtopicPage
    title="SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="⚖️"
    kelasLabel="Kelas 8"
  />
);

export default SPLDVPage;
