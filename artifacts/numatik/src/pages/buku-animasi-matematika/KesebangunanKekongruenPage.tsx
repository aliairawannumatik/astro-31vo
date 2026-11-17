import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI KESEBANGUNAN DAN KEKONGRUENAN", path: "/buku-animasi-matematika/kesebangunan-kekongruenan/definisi", icon: "📖" },
  { label: "MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN", path: "/buku-animasi-matematika/kesebangunan-kekongruenan/menghitung-rusuk", icon: "📏" },
  { label: "SEGITIGA – SEGITIGA YANG SEBANGUN", path: "/buku-animasi-matematika/kesebangunan-kekongruenan/segitiga-sebangun", icon: "🔺" },
  { label: "MENEMUKAN PERBANDINGAN/RASIO RUSUK-RUSUK SEGITIGA SIKU SIKU DENGAN KONSEP KESEBANGUNAN", path: "/buku-animasi-matematika/kesebangunan-kekongruenan/perbandingan-rusuk-siku-siku", icon: "↔️" },
  { label: "KEKONGRUENAN PADA BANGUN DATAR", path: "/buku-animasi-matematika/kesebangunan-kekongruenan/kekongruenan", icon: "🔷" },
];

const KesebangunanKekongruenPage = () => (
  <MateriTopicPage
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    emoji="🔷"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/buku-animasi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default KesebangunanKekongruenPage;
