import TetrisGamePage from "@/pages/numatik-gamez/umum/TetrisGamePage";

import { PENJUMLAHAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
const PenjumlahanTetrisGamePage = () => (
  <TetrisGamePage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/penjumlahan"
    homePath="/menu"

    quizQuestions={PENJUMLAHAN_TETRIS_QUIZ}
  />
);

export default PenjumlahanTetrisGamePage;
