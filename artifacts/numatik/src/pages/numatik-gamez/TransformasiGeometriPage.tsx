import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "TRANSLASI (PERGESERAN)", path: "/numatik-gamez/transformasi-geometri/translasi" },
  { name: "REFLEKSI (PENCERMINAN)", path: "/numatik-gamez/transformasi-geometri/refleksi" },
  { name: "ROTASI (PERPUTARAN)", path: "/numatik-gamez/transformasi-geometri/rotasi" },
  { name: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/numatik-gamez/transformasi-geometri/dilatasi" },
];

const TransformasiGeometriPage = () => (
  <GameSubtopicPage
    title="TRANSFORMASI GEOMETRI"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="🔄"
    kelasLabel="Kelas 9"
  />
);

export default TransformasiGeometriPage;
