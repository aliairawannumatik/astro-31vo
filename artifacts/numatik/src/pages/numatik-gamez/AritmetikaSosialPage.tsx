import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "JUAL BELI, UNTUNG DAN RUGI", path: "/numatik-gamez/aritmetika-sosial/jual-beli-untung-rugi" },
  { name: "DISKON", path: "/numatik-gamez/aritmetika-sosial/diskon" },
  { name: "BRUTO, NETTO DAN TARA", path: "/numatik-gamez/aritmetika-sosial/bruto-netto-tara" },
  { name: "BUNGA TUNGGAL", path: "/numatik-gamez/aritmetika-sosial/bunga-tunggal" },
  { name: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/numatik-gamez/aritmetika-sosial/ppn" },
  { name: "PAJAK PENGHASILAN (PPh)", path: "/numatik-gamez/aritmetika-sosial/pph" },
];

const AritmetikaSosialPage = () => (
  <GameSubtopicPage title="ARITMETIKA SOSIAL" subtopics={subtopics} icon="💰" />
);

export default AritmetikaSosialPage;
