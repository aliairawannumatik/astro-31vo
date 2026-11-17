import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { PENGURANGAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_GALAKSI_QUIZ}
  />
);

export default PenguranganGalaksiTempurGamePage;
