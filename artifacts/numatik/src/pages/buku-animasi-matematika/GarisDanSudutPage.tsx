import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "HUBUNGAN 2 GARIS", path: "/buku-animasi-matematika/garis-dan-sudut/hubungan-dua-garis", icon: "↔️" },
  { label: "SUDUT PELURUS, SUDUT PENYIKU & SUDUT BERTOLAK BELAKANG", path: "/buku-animasi-matematika/garis-dan-sudut/sudut-pelurus-penyiku-bertolak", icon: "📐" },
  { label: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/buku-animasi-matematika/garis-dan-sudut/sifat-sudut-sejajar", icon: "📏" },
  { label: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/buku-animasi-matematika/garis-dan-sudut/jumlah-sudut-segi-banyak", icon: "🔺" },
];

const subtopicsByEn = [
  { label: "RELATIONSHIP BETWEEN TWO LINES", path: "/buku-animasi-matematika/garis-dan-sudut/hubungan-dua-garis", icon: "↔️" },
  { label: "SUPPLEMENTARY, COMPLEMENTARY & VERTICAL ANGLES", path: "/buku-animasi-matematika/garis-dan-sudut/sudut-pelurus-penyiku-bertolak", icon: "📐" },
  { label: "PARALLEL LINES CUT BY A TRANSVERSAL", path: "/buku-animasi-matematika/garis-dan-sudut/sifat-sudut-sejajar", icon: "📏" },
  { label: "POLYGON ANGLE SUMS", path: "/buku-animasi-matematika/garis-dan-sudut/jumlah-sudut-segi-banyak", icon: "🔺" },
];

const subtopicsByJa = [
  { label: "2直線の関係", path: "/buku-animasi-matematika/garis-dan-sudut/hubungan-dua-garis", icon: "↔️" },
  { label: "補角・余角・対頂角", path: "/buku-animasi-matematika/garis-dan-sudut/sudut-pelurus-penyiku-bertolak", icon: "📐" },
  { label: "平行線と角（錯角・同位角）", path: "/buku-animasi-matematika/garis-dan-sudut/sifat-sudut-sejajar", icon: "📏" },
  { label: "多角形の内角の和", path: "/buku-animasi-matematika/garis-dan-sudut/jumlah-sudut-segi-banyak", icon: "🔺" },
];

const titles = { id: "GARIS DAN SUDUT", en: "LINES AND ANGLES", ja: "直線と角" };
const kelas  = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const GarisDanSudutPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="📐"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default GarisDanSudutPage;
