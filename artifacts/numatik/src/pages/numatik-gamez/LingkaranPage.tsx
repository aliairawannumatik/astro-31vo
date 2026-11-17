import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "UNSUR-UNSUR LINGKARAN", path: "/numatik-gamez/lingkaran/unsur-unsur" },
  { name: "KELILING DAN LUAS LINGKARAN", path: "/numatik-gamez/lingkaran/keliling-luas" },
  { name: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "/numatik-gamez/lingkaran/kaitan-bangun-datar" },
  { name: "PANJANG BUSUR DAN LUAS JURING", path: "/numatik-gamez/lingkaran/busur-juring" },
  { name: "SUDUT PUSAT DAN SUDUT KELILING", path: "/numatik-gamez/lingkaran/sudut-pusat-keliling" },
  { name: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "/numatik-gamez/lingkaran/penerapan-kontekstual" },
];

const LingkaranPage = () => (
  <GameSubtopicPage
    title="LINGKARAN"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 8"
    icon="⭕"
    kelasLabel="Kelas 8"
  />
);

export default LingkaranPage;
