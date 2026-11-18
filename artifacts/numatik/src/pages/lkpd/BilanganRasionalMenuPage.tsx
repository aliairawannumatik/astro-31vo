import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "ARTI PECAHAN & PECAHAN SENILAI", path: "/lkpd/bilangan-rasional/arti-pecahan", icon: "🍕" },
  { label: "PECAHAN CAMPURAN", path: "/lkpd/bilangan-rasional/pecahan-campuran", icon: "🍰" },
  { label: "PENJUMLAHAN & PENGURANGAN PECAHAN", path: "/lkpd/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN PECAHAN", path: "/lkpd/bilangan-rasional/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN PECAHAN", path: "/lkpd/bilangan-rasional/pembagian", icon: "➗" },
  { label: "BENTUK DESIMAL", path: "/lkpd/bilangan-rasional/bentuk-desimal", icon: "🔢" },
  { label: "OPERASI BENTUK DESIMAL", path: "/lkpd/bilangan-rasional/operasi-desimal", icon: "🧮" },
];

const BilanganRasionalMenuPage = () => (
  <MateriTopicPage
    title="LKPD PECAHAN"
    emoji="🍕"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default BilanganRasionalMenuPage;
