import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/buku-animasi-matematika/peluang/ruang-sampel", icon: "🎯" },
  { label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/buku-animasi-matematika/peluang/peluang-empirik", icon: "📊" },
  { label: "PELUANG TEORETIK", path: "/buku-animasi-matematika/peluang/peluang-teoretik", icon: "🎲" },
  { label: "FREKUENSI HARAPAN", path: "/buku-animasi-matematika/peluang/frekuensi-harapan", icon: "📈" },
  { label: "KOMPLEMEN SUATU KEJADIAN", path: "/buku-animasi-matematika/peluang/komplemen", icon: "🔄" },
  { label: "PELUANG KEJADIAN MAJEMUK", path: "/buku-animasi-matematika/peluang/kejadian-majemuk", icon: "🔗" },
];

const subtopicsEn = [
  { label: "SAMPLE SPACE AND SAMPLE POINTS", path: "/buku-animasi-matematika/peluang/ruang-sampel", icon: "🎯" },
  { label: "EMPIRICAL PROBABILITY & RELATIVE FREQUENCY", path: "/buku-animasi-matematika/peluang/peluang-empirik", icon: "📊" },
  { label: "THEORETICAL PROBABILITY", path: "/buku-animasi-matematika/peluang/peluang-teoretik", icon: "🎲" },
  { label: "EXPECTED FREQUENCY", path: "/buku-animasi-matematika/peluang/frekuensi-harapan", icon: "📈" },
  { label: "COMPLEMENT OF AN EVENT", path: "/buku-animasi-matematika/peluang/komplemen", icon: "🔄" },
  { label: "COMPOUND EVENTS", path: "/buku-animasi-matematika/peluang/kejadian-majemuk", icon: "🔗" },
];

const subtopicsJa = [
  { label: "標本空間と標本点", path: "/buku-animasi-matematika/peluang/ruang-sampel", icon: "🎯" },
  { label: "経験的確率と相対度数", path: "/buku-animasi-matematika/peluang/peluang-empirik", icon: "📊" },
  { label: "理論的確率", path: "/buku-animasi-matematika/peluang/peluang-teoretik", icon: "🎲" },
  { label: "期待度数", path: "/buku-animasi-matematika/peluang/frekuensi-harapan", icon: "📈" },
  { label: "余事象（事象の補集合）", path: "/buku-animasi-matematika/peluang/komplemen", icon: "🔄" },
  { label: "複合事象", path: "/buku-animasi-matematika/peluang/kejadian-majemuk", icon: "🔗" },
];

const PeluangPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "PROBABILITY" :
    language === "ja" ? "確率" :
    "PELUANG";
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
      emoji="🎲"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default PeluangPage;
