import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { PERKALIAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PerkalianSnakeMathGamePage;
