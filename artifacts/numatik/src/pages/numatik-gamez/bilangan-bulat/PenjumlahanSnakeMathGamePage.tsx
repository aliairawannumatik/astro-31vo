import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { PENJUMLAHAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenjumlahanSnakeMathGamePage;
