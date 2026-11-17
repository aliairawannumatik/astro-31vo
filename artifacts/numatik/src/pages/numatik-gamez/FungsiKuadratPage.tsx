import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "/numatik-gamez/fungsi-kuadrat/bentuk-umum-karakteristik" },
  { name: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "/numatik-gamez/fungsi-kuadrat/titik-potong" },
  { name: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "/numatik-gamez/fungsi-kuadrat/sumbu-simetri" },
  { name: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "/numatik-gamez/fungsi-kuadrat/menggambar-grafik" },
  { name: "MENYUSUN FUNGSI KUADRAT", path: "/numatik-gamez/fungsi-kuadrat/menyusun-fungsi" },
  { name: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "/numatik-gamez/fungsi-kuadrat/penerapan" },
];

const FungsiKuadratPage = () => (
  <GameSubtopicPage
    title="FUNGSI KUADRAT (PENGAYAAN)"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="📉"
    kelasLabel="Kelas 9"
  />
);

export default FungsiKuadratPage;
