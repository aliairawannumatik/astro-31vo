import MeteorShootingGame from "@/components/MeteorShootingGame";
import { quizQuestions } from "@/data/quizData";

const KubusGamePage = () => {
  return (
    <MeteorShootingGame
      questions={quizQuestions}
      topicLabel="Kelas 8 · Bangun Ruang Sisi Datar · Kubus"
      backPath="/numatik-gamez/bangun-ruang-sisi-datar"
      backLabel="Kembali ke Bangun Ruang Sisi Datar"
    />
  );
};

export default KubusGamePage;
