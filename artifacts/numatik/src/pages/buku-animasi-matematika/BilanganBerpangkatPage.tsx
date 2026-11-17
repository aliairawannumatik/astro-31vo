import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "PENGERTIAN DAN NOTASI PANGKAT", path: "/buku-animasi-matematika/bilangan-berpangkat/pengertian-notasi", icon: "📝" },
  { label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "/buku-animasi-matematika/bilangan-berpangkat/sifat-sifat-operasi", icon: "⚡" },
  { label: "BENTUK AKAR", path: "/buku-animasi-matematika/bilangan-berpangkat/bentuk-akar", icon: "🌱" },
  { label: "NOTASI ILMIAH", path: "/buku-animasi-matematika/bilangan-berpangkat/notasi-ilmiah", icon: "🔬" },
];

const subtopicsEn = [
  { label: "INTRODUCTION TO EXPONENTS & NOTATION", path: "/buku-animasi-matematika/bilangan-berpangkat/pengertian-notasi", icon: "📝" },
  { label: "LAWS OF EXPONENTS", path: "/buku-animasi-matematika/bilangan-berpangkat/sifat-sifat-operasi", icon: "⚡" },
  { label: "RADICAL EXPRESSIONS", path: "/buku-animasi-matematika/bilangan-berpangkat/bentuk-akar", icon: "🌱" },
  { label: "SCIENTIFIC NOTATION", path: "/buku-animasi-matematika/bilangan-berpangkat/notasi-ilmiah", icon: "🔬" },
];

const subtopicsJa = [
  { label: "累乗の概念と表記", path: "/buku-animasi-matematika/bilangan-berpangkat/pengertian-notasi", icon: "📝" },
  { label: "指数法則", path: "/buku-animasi-matematika/bilangan-berpangkat/sifat-sifat-operasi", icon: "⚡" },
  { label: "根号の表現", path: "/buku-animasi-matematika/bilangan-berpangkat/bentuk-akar", icon: "🌱" },
  { label: "科学的記数法", path: "/buku-animasi-matematika/bilangan-berpangkat/notasi-ilmiah", icon: "🔬" },
];

const BilanganBerpangkatPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "EXPONENTS & POWERS" :
    language === "ja" ? "累乗・指数" :
    "BILANGAN BERPANGKAT";
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
      emoji="⚡"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default BilanganBerpangkatPage;
