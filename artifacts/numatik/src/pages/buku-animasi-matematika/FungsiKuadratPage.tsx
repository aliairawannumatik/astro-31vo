import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "/buku-animasi-matematika/fungsi-kuadrat/bentuk-umum-karakteristik", icon: "📖" },
  { label: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "/buku-animasi-matematika/fungsi-kuadrat/titik-potong", icon: "🎯" },
  { label: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "/buku-animasi-matematika/fungsi-kuadrat/sumbu-simetri", icon: "🪞" },
  { label: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "/buku-animasi-matematika/fungsi-kuadrat/menggambar-grafik", icon: "✏️" },
  { label: "MENYUSUN FUNGSI KUADRAT", path: "/buku-animasi-matematika/fungsi-kuadrat/menyusun-fungsi", icon: "🔧" },
  { label: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "/buku-animasi-matematika/fungsi-kuadrat/penerapan-nilai-maks-min", icon: "🏆" },
];

const subtopicsEn = [
  { label: "GENERAL FORM AND CHARACTERISTICS OF THE GRAPH", path: "/buku-animasi-matematika/fungsi-kuadrat/bentuk-umum-karakteristik", icon: "📖" },
  { label: "INTERCEPTS WITH THE AXES", path: "/buku-animasi-matematika/fungsi-kuadrat/titik-potong", icon: "🎯" },
  { label: "AXIS OF SYMMETRY AND VERTEX (OPTIMUM POINT)", path: "/buku-animasi-matematika/fungsi-kuadrat/sumbu-simetri", icon: "🪞" },
  { label: "GRAPHING QUADRATIC FUNCTIONS", path: "/buku-animasi-matematika/fungsi-kuadrat/menggambar-grafik", icon: "✏️" },
  { label: "FORMING QUADRATIC FUNCTIONS", path: "/buku-animasi-matematika/fungsi-kuadrat/menyusun-fungsi", icon: "🔧" },
  { label: "APPLICATIONS OF QUADRATIC FUNCTIONS (MAX/MIN VALUES)", path: "/buku-animasi-matematika/fungsi-kuadrat/penerapan-nilai-maks-min", icon: "🏆" },
];

const subtopicsJa = [
  { label: "一般形とグラフの特徴", path: "/buku-animasi-matematika/fungsi-kuadrat/bentuk-umum-karakteristik", icon: "📖" },
  { label: "軸との切片", path: "/buku-animasi-matematika/fungsi-kuadrat/titik-potong", icon: "🎯" },
  { label: "対称軸と頂点（最適点）", path: "/buku-animasi-matematika/fungsi-kuadrat/sumbu-simetri", icon: "🪞" },
  { label: "二次関数のグラフの描き方", path: "/buku-animasi-matematika/fungsi-kuadrat/menggambar-grafik", icon: "✏️" },
  { label: "二次関数の作成", path: "/buku-animasi-matematika/fungsi-kuadrat/menyusun-fungsi", icon: "🔧" },
  { label: "二次関数の応用（最大値・最小値）", path: "/buku-animasi-matematika/fungsi-kuadrat/penerapan-nilai-maks-min", icon: "🏆" },
];

const FungsiKuadratPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "QUADRATIC FUNCTION (ENRICHMENT)" :
    language === "ja" ? "二次関数（発展）" :
    "FUNGSI KUADRAT (PENGAYAAN)";
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
      emoji="📈"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default FungsiKuadratPage;
