import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN", path: "/numatik-gamez/bilangan-rasional/arti-pecahan" },
  { name: "PECAHAN CAMPURAN DAN PERSEN", path: "/numatik-gamez/bilangan-rasional/pecahan-campuran" },
  { name: "PENJUMLAHAN PECAHAN", path: "/numatik-gamez/bilangan-rasional/penjumlahan-pecahan" },
  { name: "PENGURANGAN PECAHAN", path: "/numatik-gamez/bilangan-rasional/pengurangan-pecahan" },
  { name: "PERKALIAN PECAHAN", path: "/numatik-gamez/bilangan-rasional/perkalian-pecahan" },
  { name: "PEMBAGIAN PECAHAN", path: "/numatik-gamez/bilangan-rasional/pembagian-pecahan" },
  { name: "BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/bentuk-desimal" },
  { name: "PENJUMLAHAN BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/penjumlahan-desimal" },
  { name: "PENGURANGAN BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/pengurangan-desimal" },
  { name: "PERKALIAN BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/perkalian-desimal" },
  { name: "PEMBAGIAN BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/pembagian-desimal" },
  { name: "PEMBULATAN BENTUK DESIMAL", path: "/numatik-gamez/bilangan-rasional/pembulatan-desimal" },
];

const BilanganRasionalPage = () => (
  <GameSubtopicPage title="PECAHAN" subtopics={subtopics} icon="🧮" />
);

export default BilanganRasionalPage;
