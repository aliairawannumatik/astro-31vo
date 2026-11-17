import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN POLA DAN BARISAN BILANGAN", path: "/numatik-gamez/pola-bilangan/pengertian-pola" },
  { name: "POLA-POLA KHUSUS", path: "/numatik-gamez/pola-bilangan/pola-khusus" },
  { name: "BARISAN DAN DERET ARITMETIKA", path: "/numatik-gamez/pola-bilangan/pola-aritmetika" },
  { name: "BARISAN DAN DERET GEOMETRI", path: "/numatik-gamez/pola-bilangan/pola-geometri" },
];

const PolaBilanganPage = () => (
  <GameSubtopicPage
    title="POLA BILANGAN"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="🔢"
    kelasLabel="Kelas 8"
  />
);

export default PolaBilanganPage;
