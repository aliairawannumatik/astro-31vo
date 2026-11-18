import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TRANSLASI (PERGESERAN)", path: "/lkpd/transformasi-geometri/translasi", icon: "➡️" },
  { label: "REFLEKSI (PENCERMINAN)", path: "/lkpd/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "ROTASI (PERPUTARAN)", path: "/lkpd/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/lkpd/transformasi-geometri/dilatasi", icon: "🔭" },
];

const TransformasiGeometriMenuPage = () => (
  <MateriTopicPage
    title="LKPD TRANSFORMASI GEOMETRI"
    emoji="🔭"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default TransformasiGeometriMenuPage;
