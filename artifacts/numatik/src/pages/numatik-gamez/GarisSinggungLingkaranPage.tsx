import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/numatik-gamez/garis-singgung-lingkaran/pengertian-sifat" },
  { name: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/numatik-gamez/garis-singgung-lingkaran/panjang-garis-singgung" },
  { name: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/numatik-gamez/garis-singgung-lingkaran/gspl" },
  { name: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/numatik-gamez/garis-singgung-lingkaran/gspd" },
  { name: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/numatik-gamez/garis-singgung-lingkaran/sabuk-lilitan" },
];

const GarisSinggungLingkaranPage = () => (
  <GameSubtopicPage
    title="GARIS SINGGUNG LINGKARAN"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="🔵"
    kelasLabel="Kelas 8"
  />
);

export default GarisSinggungLingkaranPage;
