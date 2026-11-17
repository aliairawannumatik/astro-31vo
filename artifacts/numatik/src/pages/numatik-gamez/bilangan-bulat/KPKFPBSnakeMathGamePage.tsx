import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { KPK_FPB_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="KPK DAN FPB"
    backPath="/numatik-gamez/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default KPKFPBSnakeMathGamePage;
