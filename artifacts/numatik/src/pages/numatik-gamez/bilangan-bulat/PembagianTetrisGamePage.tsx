import TetrisGamePage from "@/pages/numatik-gamez/umum/TetrisGamePage";

import { PEMBAGIAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const PembagianTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/numatik-gamez/bilangan-bulat/pembagian"
      homePath="/menu"

      quizQuestions={PEMBAGIAN_TETRIS_QUIZ}
    />
  );

  export default PembagianTetrisGamePage;
  