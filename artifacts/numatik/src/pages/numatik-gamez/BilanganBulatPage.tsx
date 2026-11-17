import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENJUMLAHAN BILANGAN BULAT", path: "/numatik-gamez/bilangan-bulat/penjumlahan" },
  { name: "PENGURANGAN BILANGAN BULAT", path: "/numatik-gamez/bilangan-bulat/pengurangan" },
  { name: "PERKALIAN BILANGAN BULAT", path: "/numatik-gamez/bilangan-bulat/perkalian" },
  { name: "PEMBAGIAN BILANGAN BULAT", path: "/numatik-gamez/bilangan-bulat/pembagian" },
  { name: "OPERASI HITUNG CAMPURAN BILANGAN BULAT", path: "/numatik-gamez/bilangan-bulat/operasi-campuran" },
  { name: "KPK DAN FPB", path: "/numatik-gamez/bilangan-bulat/kpk-fpb" },
];

const BilanganBulatPage = () => (
  <GameSubtopicPage title="BILANGAN BULAT" subtopics={subtopics} icon="🔢" />
);

export default BilanganBulatPage;
