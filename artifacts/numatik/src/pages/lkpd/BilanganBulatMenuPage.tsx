import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENJUMLAHAN BILANGAN BULAT", path: "/lkpd/bilangan-bulat/penjumlahan", icon: "➕" },
  { label: "PENGURANGAN BILANGAN BULAT", path: "/lkpd/bilangan-bulat/pengurangan", icon: "➖" },
  { label: "PERKALIAN BILANGAN BULAT", path: "/lkpd/bilangan-bulat/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN BILANGAN BULAT", path: "/lkpd/bilangan-bulat/pembagian", icon: "➗" },
  { label: "OPERASI HITUNG CAMPURAN", path: "/lkpd/bilangan-bulat/operasi-campuran", icon: "🔢" },
  { label: "KPK DAN FPB", path: "/lkpd/bilangan-bulat/kpk-fpb", icon: "🌐" },
];

const BilanganBulatMenuPage = () => (
  <MateriTopicPage
    title="LKPD BILANGAN BULAT"
    emoji="🔢"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default BilanganBulatMenuPage;
