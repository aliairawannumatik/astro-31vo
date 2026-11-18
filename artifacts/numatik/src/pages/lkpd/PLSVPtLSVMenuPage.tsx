import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KALIMAT TERBUKA & TERTUTUP", path: "/lkpd/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "💬" },
  { label: "PENGERTIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/pengertian-plsv", icon: "🎯" },
  { label: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/penyelesaian-plsv", icon: "⚖️" },
  { label: "MODEL MATEMATIKA PERSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/model-matematika-plsv", icon: "🧠" },
  { label: "PENGERTIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/pengertian-ptlsv", icon: "🚦" },
  { label: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/penyelesaian-ptlsv", icon: "🪜" },
  { label: "MODEL MATEMATIKA PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/plsv-ptlsv/model-matematika-ptlsv", icon: "🛒" },
];

const PLSVPtLSVMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
    emoji="⚖️"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default PLSVPtLSVMenuPage;
