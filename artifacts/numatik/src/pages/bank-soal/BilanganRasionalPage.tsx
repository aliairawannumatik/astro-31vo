import PracticeCollectionBankPage from "@/components/bank-soal/PracticeCollectionBankPage";
import ArtiPecahanSenilaiMembandingkanPage from "@/pages/tugas-latihan-mandiri/pecahan/ArtiPecahanSenilaiMembandingkanPage";
import PecahanCampuranPersenPage from "@/pages/tugas-latihan-mandiri/pecahan/PecahanCampuranPersenPage";
import PenjumlahanPecahanPage from "@/pages/tugas-latihan-mandiri/pecahan/PenjumlahanPecahanPage";
import PerkalianPecahanPage from "@/pages/tugas-latihan-mandiri/pecahan/PerkalianPecahanPage";
import PembagianPecahanPage from "@/pages/tugas-latihan-mandiri/pecahan/PembagianPecahanPage";
import BentukDesimalPage from "@/pages/tugas-latihan-mandiri/pecahan/BentukDesimalPage";
import PenjumlahanPenguranganDesimalPage from "@/pages/tugas-latihan-mandiri/pecahan/PenjumlahanPenguranganDesimalPage";
import PerkalianDesimalPage from "@/pages/tugas-latihan-mandiri/pecahan/PerkalianDesimalPage";
import PembagianDesimalPage from "@/pages/tugas-latihan-mandiri/pecahan/PembagianDesimalPage";
import PembulatanDesimalPage from "@/pages/tugas-latihan-mandiri/pecahan/PembulatanDesimalPage";

const sections = [
  ["ARTI PECAHAN, PECAHAN SENILAI, DAN MEMBANDINGKAN PECAHAN", ArtiPecahanSenilaiMembandingkanPage],
  ["PECAHAN CAMPURAN DAN PERSEN", PecahanCampuranPersenPage],
  ["PENJUMLAHAN DAN PENGURANGAN PECAHAN", PenjumlahanPecahanPage],
  ["PERKALIAN PECAHAN", PerkalianPecahanPage],
  ["PEMBAGIAN PECAHAN", PembagianPecahanPage],
  ["BENTUK DESIMAL", BentukDesimalPage],
  ["PENJUMLAHAN DAN PENGURANGAN DESIMAL", PenjumlahanPenguranganDesimalPage],
  ["PERKALIAN DESIMAL", PerkalianDesimalPage],
  ["PEMBAGIAN DESIMAL", PembagianDesimalPage],
  ["PEMBULATAN DESIMAL", PembulatanDesimalPage],
] as const;

export default function BilanganRasionalPage() {
  return (
    <PracticeCollectionBankPage
      title="BANK SOAL – BILANGAN RASIONAL"
      subtitle="Soal dari seluruh subtopik Tugas-Latihan Mandiri Bilangan Rasional"
      sections={sections.map(([label, Page]) => ({ label, Page }))}
    />
  );
}