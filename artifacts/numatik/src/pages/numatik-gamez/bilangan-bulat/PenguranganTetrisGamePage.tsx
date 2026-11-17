import TetrisGamePage from "@/pages/numatik-gamez/umum/TetrisGamePage";

import { PENGURANGAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const PenguranganTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/numatik-gamez/bilangan-bulat/pengurangan"
      homePath="/menu"

      quizQuestions={PENGURANGAN_TETRIS_QUIZ}
    />
  );

  export default PenguranganTetrisGamePage;
  