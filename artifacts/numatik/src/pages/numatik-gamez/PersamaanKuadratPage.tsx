import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/numatik-gamez/persamaan-kuadrat/bentuk-umum" },
  { name: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/numatik-gamez/persamaan-kuadrat/pemfaktoran" },
  { name: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/numatik-gamez/persamaan-kuadrat/rumus-kuadratik" },
  { name: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/numatik-gamez/persamaan-kuadrat/pelengkap-kuadrat" },
  { name: "DISKRIMINAN", path: "/numatik-gamez/persamaan-kuadrat/diskriminan" },
  { name: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/numatik-gamez/persamaan-kuadrat/menyusun-persamaan" },
  { name: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/numatik-gamez/persamaan-kuadrat/penerapan" },
];

const PersamaanKuadratPage = () => (
  <GameSubtopicPage
    title="PERSAMAAN KUADRAT (PENGAYAAN)"
    subtopics={subtopics}
    backPath="/numatik-gamez"
    backLabel="Kembali ke Kelas 9"
    icon="📈"
    kelasLabel="Kelas 9"
  />
);

export default PersamaanKuadratPage;
