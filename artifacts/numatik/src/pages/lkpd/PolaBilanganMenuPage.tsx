import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN POLA DAN BARISAN BILANGAN", path: "/lkpd/pola-bilangan/lkpd", icon: "📝" },
  { label: "POLA-POLA KHUSUS", path: "/lkpd/pola-bilangan/lkpd", icon: "⭐" },
  { label: "BARISAN DAN DERET ARITMETIKA", path: "/lkpd/pola-bilangan/lkpd", icon: "➕" },
  { label: "BARISAN DAN DERET GEOMETRI", path: "/lkpd/pola-bilangan/lkpd", icon: "📐" },
];

const PolaBilanganMenuPage = () => (
  <MateriTopicPage
    title="LKPD POLA BILANGAN"
    emoji="🔢"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default PolaBilanganMenuPage;
