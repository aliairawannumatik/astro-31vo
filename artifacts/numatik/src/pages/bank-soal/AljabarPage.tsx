import PracticeCollectionBankPage from "@/components/bank-soal/PracticeCollectionBankPage";
import PengertianUnsurAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/PengertianUnsurAljabarPage";
import PenjumlahanPenguranganAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/PenjumlahanPenguranganAljabarPage";
import PerkalianAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/PerkalianAljabarPage";
import PembagianAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/PembagianAljabarPage";
import PemangkatanAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/PemangkatanAljabarPage";
import SubstitusiBilanganAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/SubstitusiBilanganAljabarPage";
import FaktorisasiAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/FaktorisasiAljabarPage";
import MenyederhanakanPecahanAljabarPage from "@/pages/tugas-latihan-mandiri/aljabar/MenyederhanakanPecahanAljabarPage";

const sections = [
  ["PENGERTIAN DAN UNSUR-UNSUR ALJABAR", PengertianUnsurAljabarPage],
  ["PENJUMLAHAN DAN PENGURANGAN ALJABAR", PenjumlahanPenguranganAljabarPage],
  ["PERKALIAN ALJABAR", PerkalianAljabarPage],
  ["PEMBAGIAN ALJABAR", PembagianAljabarPage],
  ["PEMANGKATAN ALJABAR", PemangkatanAljabarPage],
  ["SUBSTITUSI BILANGAN PADA BENTUK ALJABAR", SubstitusiBilanganAljabarPage],
  ["FAKTORISASI ALJABAR", FaktorisasiAljabarPage],
  ["MENYEDERHANAKAN PECAHAN ALJABAR", MenyederhanakanPecahanAljabarPage],
] as const;

export default function AljabarPage() {
  return (
    <PracticeCollectionBankPage
      title="BANK SOAL – ALJABAR"
      subtitle="Soal dari seluruh subtopik Tugas-Latihan Mandiri Aljabar"
      sections={sections.map(([label, Page]) => ({ label, Page }))}
    />
  );
}