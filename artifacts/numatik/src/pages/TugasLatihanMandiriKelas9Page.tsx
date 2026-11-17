import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const topicsKelas9 = [
  { label: "BILANGAN BERPANGKAT", path: "/tugas-latihan-mandiri/bilangan-berpangkat" },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", path: "/tugas-latihan-mandiri/kesebangunan-kekongruenan" },
  { label: "TRANSFORMASI GEOMETRI", path: "/tugas-latihan-mandiri/transformasi-geometri" },
  { label: "BANGUN RUANG SISI LENGKUNG", path: "/tugas-latihan-mandiri/bangun-ruang-sisi-lengkung" },
  { label: "STATISTIKA", path: "/tugas-latihan-mandiri/statistika" },
  { label: "PELUANG", path: "/tugas-latihan-mandiri/peluang" },
  { label: "PERSAMAAN KUADRAT (PENGAYAAN)", path: "/tugas-latihan-mandiri/persamaan-kuadrat" },
  { label: "FUNGSI KUADRAT (PENGAYAAN)", path: "/tugas-latihan-mandiri/fungsi-kuadrat" },
];

const TugasLatihanMandiriKelas9Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.title')}
        </h1>
        <p className={`${isDark ? "text-white/60" : "text-slate-600"} text-sm text-center mb-8 font-body`}>
          {t('practice.selectTopic')}
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topicsKelas9.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => {
                playPopSound();
                navigate(topic.path);
              }}
              className={`group flex items-center gap-4 rounded-xl px-5 py-4
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up ${
                  isDark
                    ? "bg-card/80 backdrop-blur border border-border"
                    : "bg-white/90 border border-slate-200 shadow-sm hover:bg-cyan-50"
                }`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <BookOpen className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
              <span className={`font-body text-sm ${isDark ? "text-white" : "text-slate-800"}`}>{topic.label}</span>
              <span className="ml-auto text-xs text-accent font-display">{t('practice.openButton')}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tugas-latihan-mandiri"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToPractice')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TugasLatihanMandiriKelas9Page;
