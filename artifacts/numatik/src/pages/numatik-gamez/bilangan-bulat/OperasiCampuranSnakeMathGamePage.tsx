import SnakeMathPage from "@/pages/numatik-gamez/umum/SnakeMathPage";
import { OPERASI_CAMPURAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default OperasiCampuranSnakeMathGamePage;
