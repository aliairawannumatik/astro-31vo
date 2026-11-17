import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN NOTASI PANGKAT", path: "/numatik-gamez/bilangan-berpangkat/pengertian-notasi" },
  { name: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "/numatik-gamez/bilangan-berpangkat/sifat-operasi" },
  { name: "BENTUK AKAR", path: "/numatik-gamez/bilangan-berpangkat/bentuk-akar" },
  { name: "NOTASI ILMIAH", path: "/numatik-gamez/bilangan-berpangkat/notasi-ilmiah" },
];

const BilanganBerpangkatPage = () => (
  <GameSubtopicPage
    title="BILANGAN BERPANGKAT"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="🔢"
    kelasLabel="Kelas 9"
  />
);

export default BilanganBerpangkatPage;
