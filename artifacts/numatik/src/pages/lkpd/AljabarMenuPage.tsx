import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN & UNSUR ALJABAR", path: "/lkpd/aljabar/pengertian-unsur", icon: "🧩" },
  { label: "PENJUMLAHAN & PENGURANGAN ALJABAR", path: "/lkpd/aljabar/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN & PEMBAGIAN ALJABAR", path: "/lkpd/aljabar/perkalian-pembagian", icon: "✖️" },
  { label: "SUBSTITUSI BILANGAN", path: "/lkpd/aljabar/substitusi", icon: "🔁" },
  { label: "FAKTORISASI ALJABAR", path: "/lkpd/aljabar/faktorisasi", icon: "🧮" },
];

const AljabarMenuPage = () => (
  <MateriTopicPage
    title="LKPD ALJABAR"
    emoji="🧩"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default AljabarMenuPage;
