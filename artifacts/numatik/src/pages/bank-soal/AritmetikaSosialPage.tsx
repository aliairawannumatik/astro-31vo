import PracticeCollectionBankPage from "@/components/bank-soal/PracticeCollectionBankPage";
import JualBeliUntungRugiPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/JualBeliUntungRugiPage";
import DiskonPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/DiskonPage";
import BrutoNettoTaraPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/BrutoNettoTaraPage";
import BungaTunggalPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/BungaTunggalPage";
import PPNPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/PPNPage";
import PPhPage from "@/pages/tugas-latihan-mandiri/aritmetika-sosial/PPhPage";

const sections = [
  ["JUAL BELI, UNTUNG, DAN RUGI", JualBeliUntungRugiPage],
  ["DISKON", DiskonPage],
  ["BRUTO, NETO, DAN TARA", BrutoNettoTaraPage],
  ["BUNGA TUNGGAL", BungaTunggalPage],
  ["PAJAK PERTAMBAHAN NILAI (PPN)", PPNPage],
  ["PAJAK PENGHASILAN (PPh)", PPhPage],
] as const;

export default function AritmetikaSosialPage() {
  return (
    <PracticeCollectionBankPage
      title="BANK SOAL – ARITMETIKA SOSIAL"
      subtitle="Soal dari seluruh subtopik Tugas-Latihan Mandiri Aritmetika Sosial"
      sections={sections.map(([label, Page]) => ({ label, Page }))}
    />
  );
}