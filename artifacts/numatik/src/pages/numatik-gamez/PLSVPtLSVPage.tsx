import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "KALIMAT TERBUKA DAN TERTUTUP (PERNYATAAN)", path: "/numatik-gamez/plsv-ptlsv/kalimat-terbuka" },
  { name: "PENGERTIAN PERSAMAAN LINEAR SATU VARIABEL, KESAMAAN, DAN PERNYATAAN EKUIVALEN", path: "/numatik-gamez/plsv-ptlsv/pengertian-plsv" },
  { name: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/numatik-gamez/plsv-ptlsv/penyelesaian-plsv" },
  { name: "MODEL MATEMATIKA DAN PENERAPAN PERSAMAAN PADA SOAL CERITA", path: "/numatik-gamez/plsv-ptlsv/model-matematika-plsv" },
  { name: "PENGERTIAN KETIDAKSAMAAN, PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/numatik-gamez/plsv-ptlsv/pengertian-ptlsv" },
  { name: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/numatik-gamez/plsv-ptlsv/penyelesaian-ptlsv" },
  { name: "MODEL MATEMATIKA DAN PENERAPAN PERTIDAKSAMAAN PADA SOAL CERITA", path: "/numatik-gamez/plsv-ptlsv/model-matematika-ptlsv" },
];

const PLSVPtLSVPage = () => (
  <GameSubtopicPage
    title="PERSAMAAN & PERTIDAKSAMAAN"
    subtopics={subtopics}
    icon="⚖️"
  />
);

export default PLSVPtLSVPage;
