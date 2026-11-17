import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PEMBUKTIAN TEOREMA PYTHAGORAS", path: "/numatik-gamez/teorema-pythagoras/pembuktian" },
  { name: "MENGHITUNG PANJANG SEGITIGA SIKU-SIKU", path: "/numatik-gamez/teorema-pythagoras/menghitung-panjang" },
  { name: "TRIPLE PYTHAGORAS", path: "/numatik-gamez/teorema-pythagoras/triple-pythagoras" },
  { name: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "/numatik-gamez/teorema-pythagoras/jenis-segitiga" },
  { name: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "/numatik-gamez/teorema-pythagoras/sudut-khusus" },
  { name: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "/numatik-gamez/teorema-pythagoras/penerapan-kontekstual" },
];

const TeoremaPythagorasPage = () => (
  <GameSubtopicPage
    title="TEOREMA PYTHAGORAS"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="📐"
    kelasLabel="Kelas 8"
  />
);

export default TeoremaPythagorasPage;
