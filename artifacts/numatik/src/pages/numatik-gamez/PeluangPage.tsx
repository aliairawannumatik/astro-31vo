import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/numatik-gamez/peluang/ruang-sampel" },
  { name: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/numatik-gamez/peluang/peluang-empirik" },
  { name: "PELUANG TEORETIK", path: "/numatik-gamez/peluang/peluang-teoretik" },
  { name: "FREKUENSI HARAPAN", path: "/numatik-gamez/peluang/frekuensi-harapan" },
  { name: "KOMPLEMEN SUATU KEJADIAN", path: "/numatik-gamez/peluang/komplemen" },
  { name: "PELUANG KEJADIAN MAJEMUK", path: "/numatik-gamez/peluang/kejadian-majemuk" },
];

const PeluangPage = () => (
  <GameSubtopicPage
    title="PELUANG"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="🎲"
    kelasLabel="Kelas 9"
  />
);

export default PeluangPage;
