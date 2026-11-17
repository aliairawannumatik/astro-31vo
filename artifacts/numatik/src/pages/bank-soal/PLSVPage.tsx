import PracticeCollectionBankPage from "@/components/bank-soal/PracticeCollectionBankPage";
import KalimatTerbukaTertutupPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/KalimatTerbukaTertutupPage";
import PengertianPLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/PengertianPLSVPage";
import PenyelesaianPLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/PenyelesaianPLSVPage";
import ModelMatematikaPLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/ModelMatematikaPLSVPage";
import PengertianPtLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/PengertianPtLSVPage";
import PenyelesaianPtLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/PenyelesaianPtLSVPage";
import ModelMatematikaPtLSVPage from "@/pages/tugas-latihan-mandiri/plsv-ptlsv/ModelMatematikaPtLSVPage";

const sections = [
  ["KALIMAT TERBUKA DAN TERTUTUP", KalimatTerbukaTertutupPage],
  ["PENGERTIAN PERSAMAAN LINEAR SATU VARIABEL", PengertianPLSVPage],
  ["PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", PenyelesaianPLSVPage],
  ["MODEL MATEMATIKA DAN PENERAPAN PERSAMAAN", ModelMatematikaPLSVPage],
  ["PENGERTIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", PengertianPtLSVPage],
  ["PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", PenyelesaianPtLSVPage],
  ["MODEL MATEMATIKA DAN PENERAPAN PERTIDAKSAMAAN", ModelMatematikaPtLSVPage],
] as const;

export default function PLSVPage() {
  return (
    <PracticeCollectionBankPage
      title="BANK SOAL – PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
      subtitle="Soal dari seluruh subtopik Tugas-Latihan Mandiri PLSV dan PtLSV"
      sections={sections.map(([label, Page]) => ({ label, Page }))}
    />
  );
}