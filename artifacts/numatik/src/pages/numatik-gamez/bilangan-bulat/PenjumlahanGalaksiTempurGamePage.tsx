import GalaksiTempurPage from "@/pages/numatik-gamez/umum/GalaksiTempurPage";
import { PENJUMLAHAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/numatik-gamez/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_GALAKSI_QUIZ}
  />
);

export default PenjumlahanGalaksiTempurGamePage;
