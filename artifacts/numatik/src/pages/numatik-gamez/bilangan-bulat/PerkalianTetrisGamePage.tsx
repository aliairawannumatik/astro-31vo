import TetrisGamePage from "@/pages/numatik-gamez/umum/TetrisGamePage";

import { PERKALIAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const PerkalianTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/numatik-gamez/bilangan-bulat/perkalian"
      homePath="/menu"

      quizQuestions={PERKALIAN_TETRIS_QUIZ}
    />
  );

  export default PerkalianTetrisGamePage;
  