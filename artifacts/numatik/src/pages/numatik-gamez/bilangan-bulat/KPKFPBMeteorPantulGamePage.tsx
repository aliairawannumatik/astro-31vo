import BrickBreakerPage from "@/pages/numatik-gamez/umum/BrickBreakerPage";
import { KPK_FPB_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="KPK DAN FPB"
    backPath="/numatik-gamez/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_METEOR_PANTUL_QUIZ}
  />
);

export default KPKFPBMeteorPantulGamePage;
