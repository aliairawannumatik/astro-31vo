import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/lkpd/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/lkpd/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/lkpd/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/lkpd/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "DISKRIMINAN", path: "/lkpd/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/lkpd/persamaan-kuadrat/menyusun-baru", icon: "✏️" },
  { label: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/lkpd/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const PersamaanKuadratMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN KUADRAT (PENGAYAAN)"
    emoji="📐"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default PersamaanKuadratMenuPage;
