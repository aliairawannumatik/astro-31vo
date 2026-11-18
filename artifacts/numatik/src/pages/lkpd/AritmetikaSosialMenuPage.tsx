import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "JUAL BELI, UNTUNG & RUGI", path: "/lkpd/aritmetika-sosial/jual-beli-untung-rugi", icon: "🛍️" },
  { label: "DISKON (POTONGAN HARGA)", path: "/lkpd/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "BRUTO, NETTO & TARA", path: "/lkpd/aritmetika-sosial/bruto-netto-tara", icon: "📦" },
  { label: "BUNGA TUNGGAL", path: "/lkpd/aritmetika-sosial/bunga-tunggal", icon: "🏦" },
  { label: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/lkpd/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "PAJAK PENGHASILAN (PPh)", path: "/lkpd/aritmetika-sosial/pph", icon: "💼" },
];

const AritmetikaSosialMenuPage = () => (
  <MateriTopicPage
    title="LKPD ARITMETIKA SOSIAL"
    emoji="💰"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd"
    backLabel="Kembali ke LKPD"
    contextLabel="LKPD"
  />
);

export default AritmetikaSosialMenuPage;
