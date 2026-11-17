import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/numatik-gamez/perbandingan/perbandingan-umum" },
  { name: "PERBANDINGAN BERTINGKAT", path: "/numatik-gamez/perbandingan/perbandingan-bertingkat" },
  { name: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/numatik-gamez/perbandingan/perbandingan-senilai" },
  { name: "SKALA", path: "/numatik-gamez/perbandingan/skala" },
  { name: "PERBANDINGAN CAMPURAN", path: "/numatik-gamez/perbandingan/perbandingan-campuran" },
];

const PerbandinganPage = () => (
  <GameSubtopicPage title="PERBANDINGAN" subtopics={subtopics} icon="📐" />
);

export default PerbandinganPage;
