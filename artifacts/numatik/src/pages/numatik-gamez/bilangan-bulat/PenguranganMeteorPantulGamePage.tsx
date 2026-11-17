import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { PENGURANGAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_METEOR_PANTUL_QUIZ}
  />
);

export default PenguranganMeteorPantulGamePage;
