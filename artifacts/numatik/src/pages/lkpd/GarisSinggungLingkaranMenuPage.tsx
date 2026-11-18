import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/lkpd/garis-singgung-lingkaran/lkpd", icon: "📖" },
  { label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/lkpd/garis-singgung-lingkaran/lkpd", icon: "📏" },
  { label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/lkpd/garis-singgung-lingkaran/lkpd", icon: "↔️" },
  { label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/lkpd/garis-singgung-lingkaran/lkpd", icon: "↕️" },
  { label: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/lkpd/garis-singgung-lingkaran/lkpd", icon: "🌀" },
];

const GarisSinggungLingkaranMenuPage = () => (
  <MateriTopicPage
    title="LKPD GARIS SINGGUNG LINGKARAN"
    emoji="🌀"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default GarisSinggungLingkaranMenuPage;
