import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { OPERASI_CAMPURAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="OPERASI CAMPURAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_METEOR_PANTUL_QUIZ}
  />
);

export default OperasiCampuranMeteorPantulGamePage;
