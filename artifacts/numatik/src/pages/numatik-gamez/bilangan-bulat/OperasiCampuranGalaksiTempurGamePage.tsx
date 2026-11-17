import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { OPERASI_CAMPURAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_GALAKSI_QUIZ}
  />
);

export default OperasiCampuranGalaksiTempurGamePage;
