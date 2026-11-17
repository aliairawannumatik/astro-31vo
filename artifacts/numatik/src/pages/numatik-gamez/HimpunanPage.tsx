import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN KEANGGOTAAAN SUATU HIMPUNAN", path: "/numatik-gamez/himpunan/pengertian-keanggotaan" },
  { name: "HIMPUNAN BERHINGGA, HIMPUNAN KOSONG, DAN HIMPUNAN TAK HINGGA", path: "/numatik-gamez/himpunan/himpunan-berhingga-kosong" },
  { name: "DIAGRAM VENN", path: "/numatik-gamez/himpunan/diagram-venn" },
  { name: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN", path: "/numatik-gamez/himpunan/pemecahan-masalah" },
];

const HimpunanPage = () => (
  <GameSubtopicPage title="HIMPUNAN" subtopics={subtopics} icon="🔵" />
);

export default HimpunanPage;
