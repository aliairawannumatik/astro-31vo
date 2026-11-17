import PracticeCollectionBankPage from "@/components/bank-soal/PracticeCollectionBankPage";
import PerbandinganUmumPage from "@/pages/tugas-latihan-mandiri/perbandingan/PerbandinganUmumPage";
import PerbandinganBertingkatPage from "@/pages/tugas-latihan-mandiri/perbandingan/PerbandinganBertingkatPage";
import PerbandinganSenilaiPage from "@/pages/tugas-latihan-mandiri/perbandingan/PerbandinganSenilaiPage";
import PerbandinganSkalaPage from "@/pages/tugas-latihan-mandiri/perbandingan/PerbandinganSkalaPage";
import PerbandinganCampuranPage from "@/pages/tugas-latihan-mandiri/perbandingan/PerbandinganCampuranPage";

const sections = [
  ["PERBANDINGAN UMUM", PerbandinganUmumPage],
  ["PERBANDINGAN BERTINGKAT", PerbandinganBertingkatPage],
  ["PERBANDINGAN SENILAI", PerbandinganSenilaiPage],
  ["SKALA", PerbandinganSkalaPage],
  ["PERBANDINGAN CAMPURAN", PerbandinganCampuranPage],
] as const;

export default function PerbandinganPage() {
  return (
    <PracticeCollectionBankPage
      title="BANK SOAL – PERBANDINGAN"
      subtitle="Soal dari seluruh subtopik Tugas-Latihan Mandiri Perbandingan"
      sections={sections.map(([label, Page]) => ({ label, Page }))}
    />
  );
}