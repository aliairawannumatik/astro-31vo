import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const BiografiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10 text-center">
        <User className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-6">
          {t("biografi.pageTitle")}
        </h1>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-8 space-y-4 mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/biografi.png"
              alt="Irawan Sutiawan, M.Pd"
              className="w-32 h-40 sm:w-40 sm:h-48 object-cover rounded-xl border-2 border-primary/40 shadow-lg"
            />
          </div>

          <div className="space-y-3 text-left">
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelNama")}</p>
              <p className="text-white font-body text-sm">Irawan Sutiawan, M.Pd</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelNegara")}</p>
              <p className="text-white font-body text-sm">Indonesia</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelWebsite")}</p>
              <a
                href="https://www.numatik.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-body text-sm underline underline-offset-2 hover:text-cyan-200 transition-colors"
              >
                www.numatik.app
              </a>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelSosmed")}</p>
              <div className="space-y-2 mt-2">
                <p className="font-body text-sm text-white">Instagram : @irawansutiawan.one</p>
                <p className="font-body text-sm text-white">Instagram : @numatik_official</p>
                <p className="font-body text-sm text-white">Youtube : @numatik_official</p>
                <p className="font-body text-sm text-white">Tiktok : Pojok_Matematika</p>
              </div>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-2">{t("biografi.labelPesan")}</p>
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-4 space-y-2">
                <p className="text-cyan-300 font-display text-xs font-bold tracking-widest uppercase mb-2">
                  {t("biografi.pesanSubtitle")}
                </p>
                <p className="text-white/85 font-body text-sm leading-relaxed text-justify italic">
                  {t("biografi.pesanIsi")}
                </p>
                <p className="text-cyan-400/70 font-display text-xs font-bold text-right">— Irawan Sutiawan, M.Pd</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-2 mb-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          {t("biografi.kembali")}
        </button>
      </div>
    </div>
  );
};

export default BiografiPage;
