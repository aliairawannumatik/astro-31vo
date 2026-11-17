import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "JUAL BELI, UNTUNG DAN RUGI", path: "/buku-animasi-matematika/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "DISKON", path: "/buku-animasi-matematika/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "BRUTO, NETTO DAN TARA", path: "/buku-animasi-matematika/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "BUNGA TUNGGAL", path: "/buku-animasi-matematika/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/buku-animasi-matematika/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "PAJAK PENGHASILAN (PPH)", path: "/buku-animasi-matematika/aritmetika-sosial/pph", icon: "📋" },
];

const subtopicsByEn = [
  { label: "BUYING & SELLING — PROFIT AND LOSS", path: "/buku-animasi-matematika/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "DISCOUNT", path: "/buku-animasi-matematika/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "GROSS, NET AND TARE", path: "/buku-animasi-matematika/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "SIMPLE INTEREST", path: "/buku-animasi-matematika/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "VALUE ADDED TAX (VAT)", path: "/buku-animasi-matematika/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "INCOME TAX", path: "/buku-animasi-matematika/aritmetika-sosial/pph", icon: "📋" },
];

const subtopicsByJa = [
  { label: "売買・利益と損失", path: "/buku-animasi-matematika/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "割引", path: "/buku-animasi-matematika/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "総量・純量・風袋", path: "/buku-animasi-matematika/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "単利", path: "/buku-animasi-matematika/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "消費税（VAT）", path: "/buku-animasi-matematika/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "所得税", path: "/buku-animasi-matematika/aritmetika-sosial/pph", icon: "📋" },
];

const titles = { id: "ARITMETIKA SOSIAL", en: "SOCIAL ARITHMETIC", ja: "社会算数" };
const kelasMap = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabelMap = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const AritmetikaSosialPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;
  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="💰"
      kelas={kelasMap[lang]}
      subtopics={subtopics}
      backPath="/buku-animasi-matematika/kelas-7"
      backLabel={backLabelMap[lang]}
    />
  );
};

export default AritmetikaSosialPage;
