import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "KUBUS",                              path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "BALOK",                              path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "PRISMA",                             path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "LIMAS",                              path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN",   path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const subtopicsEn = [
  { label: "CUBE",                    path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "CUBOID",                  path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "PRISM",                   path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "PYRAMID",                 path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "COMPOUND SOLID FIGURES",  path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const subtopicsJa = [
  { label: "立方体",       path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "直方体",       path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "角柱",         path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "角錐",         path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "複合立体図形", path: "/buku-animasi-matematika/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const BangunRuangSisiDatarPage = () => {
  const { language } = useLanguage();
  const subtopics  = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title      = language === "en" ? "SOLID FIGURES WITH FLAT FACES" : language === "ja" ? "平面で囲まれた立体" : "BANGUN RUANG SISI DATAR";
  const kelas      = language === "en" ? "Grade 8" : language === "ja" ? "中学2年" : "Kelas 8";
  const backLabel  = language === "en" ? "Back to Grade 8" : language === "ja" ? "中学2年に戻る" : "Kembali ke Kelas 8";
  return (
    <MateriTopicPage
      title={title}
      emoji="📦"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-8"
      backLabel={backLabel}
    />
  );
};

export default BangunRuangSisiDatarPage;
