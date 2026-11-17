import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { PERKALIAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_METEOR_PANTUL_QUIZ}
  />
);

export default PerkalianMeteorPantulGamePage;
