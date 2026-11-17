import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING & RASIO", path: "/buku-animasi-matematika/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/buku-animasi-matematika/perbandingan/bertingkat", icon: "📶" },
  { label: "PERBANDINGAN SENILAI & BERBALIK NILAI", path: "/buku-animasi-matematika/perbandingan/senilai", icon: "🔄" },
  { label: "SKALA", path: "/buku-animasi-matematika/perbandingan/skala", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN (PENGAYAAN)", path: "/buku-animasi-matematika/perbandingan/campuran", icon: "🔀" },
];

const subtopicsByEn = [
  { label: "RATIO: DEFINITION, UNITS & COMPARISON", path: "/buku-animasi-matematika/perbandingan/umum", icon: "⚖️" },
  { label: "COMPOUND RATIO", path: "/buku-animasi-matematika/perbandingan/bertingkat", icon: "📶" },
  { label: "DIRECT & INVERSE PROPORTION", path: "/buku-animasi-matematika/perbandingan/senilai", icon: "🔄" },
  { label: "SCALE", path: "/buku-animasi-matematika/perbandingan/skala", icon: "🗺️" },
  { label: "COMBINED PROPORTION (ENRICHMENT)", path: "/buku-animasi-matematika/perbandingan/campuran", icon: "🔀" },
];

const subtopicsByJa = [
  { label: "比：定義・単位・比較", path: "/buku-animasi-matematika/perbandingan/umum", icon: "⚖️" },
  { label: "複合比", path: "/buku-animasi-matematika/perbandingan/bertingkat", icon: "📶" },
  { label: "正比例と反比例", path: "/buku-animasi-matematika/perbandingan/senilai", icon: "🔄" },
  { label: "縮尺", path: "/buku-animasi-matematika/perbandingan/skala", icon: "🗺️" },
  { label: "複合比（発展）", path: "/buku-animasi-matematika/perbandingan/campuran", icon: "🔀" },
];

const titles = { id: "PERBANDINGAN", en: "RATIO", ja: "比" };
const kelas = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const PerbandinganPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="⚖️"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default PerbandinganPage;
