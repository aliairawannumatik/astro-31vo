import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { PEMBAGIAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_METEOR_PANTUL_QUIZ}
  />
);

export default PembagianMeteorPantulGamePage;
