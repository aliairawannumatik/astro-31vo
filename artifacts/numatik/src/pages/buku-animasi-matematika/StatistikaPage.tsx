import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "PENGANTAR STATISTIKA, PENGUMPULAN DATA DAN PENYAJIAN DATA", path: "/buku-animasi-matematika/statistika/pengantar", icon: "📚" },
  { label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/buku-animasi-matematika/statistika/rata-rata", icon: "➕" },
  { label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/buku-animasi-matematika/statistika/median-modus", icon: "🎯" },
  { label: "UKURAN LETAK DATA (KUARTIL)", path: "/buku-animasi-matematika/statistika/kuartil", icon: "📐" },
  { label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)", path: "/buku-animasi-matematika/statistika/penyebaran-data", icon: "📉" },
];

const subtopicsEn = [
  { label: "INTRODUCTION TO STATISTICS, DATA COLLECTION & PRESENTATION", path: "/buku-animasi-matematika/statistika/pengantar", icon: "📚" },
  { label: "MEASURES OF CENTRAL TENDENCY (MEAN & COMBINED MEAN)", path: "/buku-animasi-matematika/statistika/rata-rata", icon: "➕" },
  { label: "MEASURES OF CENTRAL TENDENCY (MEDIAN & MODE)", path: "/buku-animasi-matematika/statistika/median-modus", icon: "🎯" },
  { label: "MEASURES OF POSITION (QUARTILES)", path: "/buku-animasi-matematika/statistika/kuartil", icon: "📐" },
  { label: "MEASURES OF DISPERSION (RANGE, INTERQUARTILE RANGE, QUARTILE DEVIATION)", path: "/buku-animasi-matematika/statistika/penyebaran-data", icon: "📉" },
];

const subtopicsJa = [
  { label: "統計の導入、データ収集と提示", path: "/buku-animasi-matematika/statistika/pengantar", icon: "📚" },
  { label: "代表値（平均値・組み合わせ平均）", path: "/buku-animasi-matematika/statistika/rata-rata", icon: "➕" },
  { label: "代表値（中央値・最頻値）", path: "/buku-animasi-matematika/statistika/median-modus", icon: "🎯" },
  { label: "位置の尺度（四分位数）", path: "/buku-animasi-matematika/statistika/kuartil", icon: "📐" },
  { label: "散らばりの尺度（範囲・四分位範囲・四分位偏差）", path: "/buku-animasi-matematika/statistika/penyebaran-data", icon: "📉" },
];

const StatistikaPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "STATISTICS" :
    language === "ja" ? "統計" :
    "STATISTIKA";
  const kelas =
    language === "en" ? "Grade 9" :
    language === "ja" ? "中学3年" :
    "Kelas 9";
  const backLabel =
    language === "en" ? "Back to Grade 9" :
    language === "ja" ? "中学3年に戻る" :
    "Kembali ke Kelas 9";

  return (
    <MateriTopicPage
      title={title}
      emoji="📊"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default StatistikaPage;
