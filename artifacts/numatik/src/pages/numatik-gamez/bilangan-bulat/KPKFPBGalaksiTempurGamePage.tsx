import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { KPK_FPB_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="KPK DAN FPB"
    backPath="/numatik-gamez/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_GALAKSI_QUIZ}
  />
);

export default KPKFPBGalaksiTempurGamePage;
