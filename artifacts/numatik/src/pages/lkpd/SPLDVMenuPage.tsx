import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/lkpd/spldv/definisi-spldv", icon: "📖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/lkpd/spldv/metode-grafik", icon: "📈" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/lkpd/spldv/metode-substitusi", icon: "🔄" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/lkpd/spldv/metode-eliminasi", icon: "➖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/lkpd/spldv/metode-campuran", icon: "🔀" },
  { label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/lkpd/spldv/model-spldv", icon: "🧮" },
  { label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/lkpd/spldv/penyelesaian-masalah", icon: "✅" },
];

const SPLDVMenuPage = () => (
  <MateriTopicPage
    title="LKPD SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    emoji="⚖️"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default SPLDVMenuPage;
