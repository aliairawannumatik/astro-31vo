import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PENGERTIAN, KEANGGOTAAN SUATU HIMPUNAN DAN MACAM-MACAM HIMPUNAN", path: "/buku-animasi-matematika/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "HIMPUNAN BAGIAN", path: "/buku-animasi-matematika/himpunan/jenis-himpunan", icon: "🗂️" },
  { label: "OPERASI HIMPUNAN, DIAGRAM VENN DAN PEMECAHAN MASALAH KONTEKSTUAL YANG BERKAITAN DENGAN HIMPUNAN", path: "/buku-animasi-matematika/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "MENYELESAIKAN MASALAH DENGAN MENGGUNAKAN KONSEP HIMPUNAN", path: "/buku-animasi-matematika/himpunan/pemecahan-masalah", icon: "🧩" },
];

const subtopicsByEn = [
  { label: "DEFINITION, MEMBERSHIP OF A SET AND TYPES OF SETS", path: "/buku-animasi-matematika/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "SUBSETS", path: "/buku-animasi-matematika/himpunan/jenis-himpunan", icon: "🗂️" },
  { label: "SET OPERATIONS, VENN DIAGRAM AND CONTEXTUAL PROBLEM SOLVING RELATED TO SETS", path: "/buku-animasi-matematika/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "SOLVING PROBLEMS USING SET CONCEPTS", path: "/buku-animasi-matematika/himpunan/pemecahan-masalah", icon: "🧩" },
];

const subtopicsByJa = [
  { label: "集合の定義・要素・集合の種類", path: "/buku-animasi-matematika/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "部分集合", path: "/buku-animasi-matematika/himpunan/jenis-himpunan", icon: "🗂️" },
  { label: "集合の演算・ベン図・集合を使った文脈的な問題解決", path: "/buku-animasi-matematika/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "集合の概念を使った問題解決", path: "/buku-animasi-matematika/himpunan/pemecahan-masalah", icon: "🧩" },
];

const titles   = { id: "HIMPUNAN", en: "SETS", ja: "集合" };
const kelas    = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const HimpunanPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="🔷"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default HimpunanPage;
