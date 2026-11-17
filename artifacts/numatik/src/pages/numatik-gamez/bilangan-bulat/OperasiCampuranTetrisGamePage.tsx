import TetrisGamePage from "@/pages/numatik-gamez/umum/TetrisGamePage";

import { OPERASI_CAMPURAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const OperasiCampuranTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/numatik-gamez/bilangan-bulat/operasi-campuran"
      homePath="/menu"

      quizQuestions={OPERASI_CAMPURAN_TETRIS_QUIZ}
    />
  );

  export default OperasiCampuranTetrisGamePage;
  