import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN KEANGGOTAAAN SUATU HIMPUNAN", path: "/lkpd/himpunan/lkpd", icon: "👥" },
  { label: "HIMPUNAN BAGIAN", path: "/lkpd/himpunan/lkpd", icon: "⊆" },
  { label: "MENYATAKAN SUATU HIMPUNAN", path: "/lkpd/himpunan/lkpd", icon: "✍️" },
  { label: "HIMPUNAN KOSONG DAN HIMPUNAN SEMESTA", path: "/lkpd/himpunan/lkpd", icon: "∅" },
  { label: "OPERASI HIMPUNAN", path: "/lkpd/himpunan/lkpd", icon: "⊕" },
  { label: "DIAGRAM VENN", path: "/lkpd/himpunan/lkpd", icon: "🔵" },
  { label: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN", path: "/lkpd/himpunan/lkpd", icon: "💡" },
  { label: "MENYELESAIKAN MASALAH DENGAN MENGGUNAKAN KONSEP HIMPUNAN", path: "/lkpd/himpunan/lkpd", icon: "🧩" },
];

const HimpunanMenuPage = () => (
  <MateriTopicPage
    title="LKPD HIMPUNAN (PENGAYAAN)"
    emoji="🎯"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default HimpunanMenuPage;
