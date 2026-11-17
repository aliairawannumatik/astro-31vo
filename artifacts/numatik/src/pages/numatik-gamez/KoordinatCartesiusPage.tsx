import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/numatik-gamez/koordinat-cartesius/unsur-unsur" },
  { name: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/numatik-gamez/koordinat-cartesius/jarak-titik" },
  { name: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "/numatik-gamez/koordinat-cartesius/posisi-relatif" },
];

const KoordinatCartesiusPage = () => (
  <GameSubtopicPage
    title="KOORDINAT KARTESIUS"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="📍"
    kelasLabel="Kelas 8"
  />
);

export default KoordinatCartesiusPage;
