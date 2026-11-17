import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { PEMBAGIAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_GALAKSI_QUIZ}
  />
);

export default PembagianGalaksiTempurGamePage;
