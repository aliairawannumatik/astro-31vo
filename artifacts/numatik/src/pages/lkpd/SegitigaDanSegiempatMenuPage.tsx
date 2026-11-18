import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "GARIS BERAT, GARIS BAGI DAN GARIS TINGGI PADA SEGITIGA", path: "/lkpd/segitiga-dan-segiempat/lkpd", icon: "📏" },
  { label: "KELILING SEGITIGA DAN SEGIEMPAT", path: "/lkpd/segitiga-dan-segiempat/lkpd", icon: "🔲" },
  { label: "LUAS SEGITIGA", path: "/lkpd/segitiga-dan-segiempat/lkpd", icon: "🔺" },
  { label: "LUAS SEGIEMPAT", path: "/lkpd/segitiga-dan-segiempat/lkpd", icon: "🔷" },
  { label: "KELILING DAN LUAS BANGUN TAK BERATURAN", path: "/lkpd/segitiga-dan-segiempat/lkpd", icon: "🔶" },
];

const SegitigaDanSegiempatMenuPage = () => (
  <MateriTopicPage
    title="LKPD SEGITIGA DAN SEGIEMPAT"
    emoji="🔺"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default SegitigaDanSegiempatMenuPage;
