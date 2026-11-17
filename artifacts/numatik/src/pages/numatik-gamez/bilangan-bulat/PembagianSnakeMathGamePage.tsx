import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { PEMBAGIAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PembagianSnakeMathGamePage;
