import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/buku-animasi-matematika/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/buku-animasi-matematika/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const subtopicsEn = [
  { label: "PROPERTIES OF CIRCLE TANGENT LINES", path: "/buku-animasi-matematika/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "CALCULATING TANGENT LINE LENGTH FROM AN EXTERNAL POINT", path: "/buku-animasi-matematika/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "EXTERNAL COMMON TANGENT (ECT)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "INTERNAL COMMON TANGENT (ICT)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "MINIMUM BELT WRAP LENGTH (APPLICATION)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const subtopicsJa = [
  { label: "接線の定義と性質", path: "/buku-animasi-matematika/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "外部の点からの接線の長さの計算", path: "/buku-animasi-matematika/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "外接共通接線 (GSPL)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "内接共通接線 (GSPD)", path: "/buku-animasi-matematika/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "最小巻き付け長さ（応用）", path: "/buku-animasi-matematika/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const titles    = { id: "GARIS SINGGUNG LINGKARAN", en: "CIRCLE TANGENT LINES", ja: "円の接線" };
const kelas     = { id: "Kelas 8", en: "Grade 8", ja: "中学2年" };
const backLabels = { id: "Kembali ke Kelas 8", en: "Back to Grade 8", ja: "中学2年に戻る" };

const GarisSinggungLingkaranPage = () => {
  const { language } = useLanguage();
  const subtopics =
    language === "en" ? subtopicsEn :
    language === "ja" ? subtopicsJa :
    subtopicsId;
  return (
    <MateriTopicPage
      title={titles[language]}
      emoji="⭕"
      kelas={kelas[language]}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-8"
      backLabel={backLabels[language]}
    />
  );
};

export default GarisSinggungLingkaranPage;
