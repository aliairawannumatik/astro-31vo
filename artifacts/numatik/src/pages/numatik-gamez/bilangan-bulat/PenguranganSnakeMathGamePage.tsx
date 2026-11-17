import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { PENGURANGAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenguranganSnakeMathGamePage;
