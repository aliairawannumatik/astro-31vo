import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/lkpd/koordinat-cartesius/lkpd", icon: "📊" },
  { label: "POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN", path: "/lkpd/koordinat-cartesius/lkpd", icon: "📍" },
  { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/lkpd/koordinat-cartesius/lkpd", icon: "📏" },
  { label: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "/lkpd/koordinat-cartesius/lkpd", icon: "🗺️" },
];

const KoordinatCartesiusMenuPage = () => (
  <MateriTopicPage
    title="LKPD KOORDINAT KARTESIUS"
    emoji="📊"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default KoordinatCartesiusMenuPage;
