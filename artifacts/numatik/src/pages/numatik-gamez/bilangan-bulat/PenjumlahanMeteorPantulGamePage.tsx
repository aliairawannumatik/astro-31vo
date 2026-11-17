import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { PENJUMLAHAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_METEOR_PANTUL_QUIZ}
  />
);

export default PenjumlahanMeteorPantulGamePage;
