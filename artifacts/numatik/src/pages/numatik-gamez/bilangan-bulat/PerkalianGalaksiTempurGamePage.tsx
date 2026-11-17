import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { PERKALIAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_GALAKSI_QUIZ}
  />
);

export default PerkalianGalaksiTempurGamePage;
