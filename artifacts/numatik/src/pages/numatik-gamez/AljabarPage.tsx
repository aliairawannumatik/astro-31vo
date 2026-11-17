import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR", path: "/numatik-gamez/aljabar/pengertian-unsur" },
  { name: "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR", path: "/numatik-gamez/aljabar/penjumlahan-pengurangan" },
  { name: "PERKALIAN BENTUK ALJABAR", path: "/numatik-gamez/aljabar/perkalian" },
  { name: "PEMBAGIAN BENTUK ALJABAR", path: "/numatik-gamez/aljabar/pembagian" },
  { name: "PEMANGKATAN BENTUK ALJABAR", path: "/numatik-gamez/aljabar/pemangkatan" },
  { name: "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR", path: "/numatik-gamez/aljabar/substitusi" },
  { name: "FAKTORISASI BENTUK ALJABAR", path: "/numatik-gamez/aljabar/faktorisasi" },
  { name: "MENYEDERHANAKAN PECAHAN ALJABAR", path: "/numatik-gamez/aljabar/operasi-pecahan" },
];

const AljabarPage = () => (
  <GameSubtopicPage title="ALJABAR" subtopics={subtopics} icon="✏️" />
);

export default AljabarPage;
