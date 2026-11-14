import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

// ─── Materi ───────────────────────────────────────────────────────────────────

const contohDiagram = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 360 180" role="img" aria-label="Diagram geometri soal Teorema Pythagoras" className="mx-auto my-3 h-auto w-full max-w-md rounded-lg border border-border bg-background p-3 text-foreground">
    {children}
  </svg>
);

const contohSoal: LatihanSoal[] = [
  {
    no: 1,
    type: "pg",
    soal: "Perhatikan gambar berikut. Pernyataan yang merupakan teorema Pythagoras dari segitiga di atas adalah ...",
    soalSvg: "soal-1",
    options: ["A. (QR)² = (PR)² − (PQ)²", "B. (PQ)² = (PR)² + (QR)²", "C. (PR)² = (QR)² + (PQ)²", "D. (QR)² = (PR)² + (PQ)²"],
    jawaban: "D",
    pembahasan: "Oleh karena sisi QR paling panjang dan merupakan hipotenusa pada segitiga siku-siku, berlaku:\n$(QR)^2 = (PR)^2 + (PQ)^2$\nJadi, jawaban yang tepat adalah D.",
  },
  {
    no: 2,
    type: "pg",
    soal: "Sebuah kapal berlayar sejauh 45 km ke arah timur, kemudian belok ke arah utara sejauh 60 km. Jarak terpendek yang dilalui kapal tersebut dari titik awal adalah ...",
    soalSvg: "soal-2",
    options: ["A. 45 km", "B. 60 km", "C. 75 km", "D. 80 km"],
    jawaban: "C",
    pembahasan: "Jarak terpendek merupakan sisi miring segitiga siku-siku:\n$AC = \\sqrt{AB^2 + BC^2}$\n$AC = \\sqrt{45^2 + 60^2} = \\sqrt{2.025 + 3.600} = \\sqrt{5.625} = 75$ km.\nJadi, jawabannya C.",
  },
  {
    no: 3,
    type: "pgkbs",
    soal: "Perhatikan gambar berikut. Berdasarkan gambar tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    soalSvg: "soal-3",
    pernyataan: ["Panjang AC = 10 cm.", "Panjang AE = 10√2 cm.", "Panjang AB = AF."],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Gunakan Teorema Pythagoras pada setiap segitiga siku-siku yang terbentuk. Dari gambar, $AC=10$ cm dan diagonal berikutnya diperoleh dengan mengalikan faktor $\\sqrt{2}$. Pernyataan (1) dan (2) sesuai dengan gambar, sedangkan pernyataan (3) tidak sesuai.",
  },
  {
    no: 4,
    type: "pgkbs",
    soal: "Sebuah eskalator panjangnya 10 m bergerak dengan kecepatan 0,4 m/s. Sudut elevasi eskalator terhadap lantai adalah 60° (√2 = 1,42 dan √3 = 1,73). Berdasarkan informasi tersebut, pilihlah benar atau salah.",
    soalSvg: "soal-4",
    pernyataan: ["Sudut antara eskalator dan dinding vertikal adalah 30°.", "Tinggi lantai yang dihubungkan oleh eskalator adalah 8,65 m.", "Waktu yang dibutuhkan untuk menaiki lantai gedung menggunakan eskalator adalah 25 detik."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Pernyataan (1): sudut eskalator terhadap lantai adalah $60°$, sehingga sudutnya terhadap dinding vertikal adalah $90°-60°=30°$ → BENAR.\nPernyataan (2): $\\sin 60° = \\frac{\\sqrt{3}}{2}$, sehingga tinggi $=10\\times\\frac{1,73}{2}=8,65$ m → BENAR.\nPernyataan (3): waktu $=\\frac{10}{0,4}=25$ detik → BENAR.",
  },
  {
    no: 5,
    type: "pgk",
    soal: "Perhatikan gambar berikut. Berdasarkan gambar tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    soalSvg: "soal-5",
    pernyataan: ["Panjang BD adalah 10 cm.", "Panjang BC adalah 25 cm.", "Luas ΔBCD adalah 5 kali luas ΔABD.", "Keliling segitiga ABD adalah 24 cm."],
    jawabanPGK: [0, 2, 3],
    jawaban: "Pernyataan (1), (3), dan (4)",
    pembahasan: "Pernyataan (1) benar: $BD=\\sqrt{AD^2+AB^2}=\\sqrt{6^2+8^2}=10$ cm.\nPernyataan (2) salah: $BC=\\sqrt{CD^2-BD^2}=\\sqrt{26^2-10^2}=24$ cm, bukan 25 cm.\nPernyataan (3) benar: luas $\\triangle BCD=\\frac{10\\times24}{2}=120$ dan luas $\\triangle ABD=\\frac{6\\times8}{2}=24$, sehingga perbandingannya $120:24=5:1$.\nPernyataan (4) benar: keliling $\\triangle ABD=6+8+10=24$ cm.",
  },
];

const contohSvgMap: Record<string, React.ReactNode> = {
  "soal-1": contohDiagram({ children: <><path d="M70 145 L70 35 L285 145 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M70 130 h15 v15" fill="none" stroke="currentColor" strokeWidth="1.5"/><text x="58" y="158" fontSize="14">P</text><text x="58" y="30" fontSize="14">R</text><text x="290" y="160" fontSize="14">Q</text><text x="158" y="166" fontSize="13">PQ</text><text x="42" y="92" fontSize="13">PR</text><text x="174" y="82" fontSize="13">QR</text></> }),
  "soal-2": contohDiagram({ children: <><path d="M70 135 L220 135 L220 45 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M205 135 h15 v-15" fill="none" stroke="currentColor" strokeWidth="1.5"/><text x="58" y="150" fontSize="14">A</text><text x="224" y="150" fontSize="14">B</text><text x="224" y="40" fontSize="14">C</text><text x="130" y="153" fontSize="13">45 km</text><text x="230" y="92" fontSize="13">60 km</text><text x="140" y="78" fontSize="13">AC</text></> }),
  "soal-3": contohDiagram({ children: <><path d="M70 145 L70 30 L160 145 L70 145 M160 145 L160 65 L250 145 Z" fill="none" stroke="currentColor" strokeWidth="2"/><text x="54" y="158" fontSize="13">A</text><text x="55" y="25" fontSize="13">F</text><text x="160" y="160" fontSize="13">C</text><text x="255" y="160" fontSize="13">E</text><text x="168" y="62" fontSize="13">10 cm</text></> }),
  "soal-4": contohDiagram({ children: <><path d="M65 145 L245 145 L245 55 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M230 145 h15 v-15" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M205 145 A40 40 0 0 0 225 110" fill="none" stroke="currentColor" strokeWidth="1.2"/><text x="52" y="158" fontSize="13">8 m</text><text x="250" y="103" fontSize="13">8,65 m</text><text x="205" y="137" fontSize="13">60°</text><text x="140" y="135" fontSize="13">10 m</text></> }),
  "soal-5": contohDiagram({ children: <><path d="M55 145 L135 145 L270 35 L135 145 L55 75 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M125 135 h10 v10" fill="none" stroke="currentColor" strokeWidth="1.5"/><text x="42" y="150" fontSize="13">A</text><text x="128" y="160" fontSize="13">B</text><text x="276" y="32" fontSize="13">C</text><text x="42" y="70" fontSize="13">D</text><text x="92" y="158" fontSize="13">8 cm</text><text x="43" y="110" fontSize="13">6 cm</text><text x="192" y="84" fontSize="13">26 cm</text></> }),
};

const materiSections: MateriSection[] = [
  {
    heading: "A. Konsep Dasar Pythagoras",
    content: `1. Kuadrat bilangan
$a^2 = a \\times a$ atau $a^2 = (-a) \\times (-a)$

2. Akar dari bilangan pada konsep Teorema Pythagoras diambil yang hasilnya positif karena sisi pada segitiga adalah bilangan positif.
$x^2 = p^2$ maka $x = p$
$x^2 = p$ maka $x = \\sqrt{p}$
$\\sqrt{a^2p} = a\\sqrt{p}$

3. Jika a, b, c merupakan sisi segitiga dan c merupakan sisi yang paling panjang, maka untuk membuat suatu segitiga harus dipenuhi syarat:
$c < a + b$

4. Jika a, b, c merupakan sisi segitiga dan c paling panjang:
$c^2 > a^2 + b^2$ : segitiga tumpul di C
$c^2 = a^2 + b^2$ : segitiga siku-siku di C
$c^2 < a^2 + b^2$ : segitiga lancip di C`,
  },
  {
    heading: "B. Teorema Pythagoras",
    content: `Diketahui segitiga siku-siku dengan sisi terpanjang c (sisi miring yang berhadapan dengan sudut siku-siku), sisi tegak a dan b, maka berlaku:

"Sisi terpanjang (sisi miring) kuadrat sama dengan jumlah kuadrat sisi-sisi lainnya."

$c^2 = a^2 + b^2$`,
  },
  {
    heading: "C. Jarak Antara 2 Titik Koordinat",
    content: `$|PQ| = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$

$|PQ|$: jarak titik P dan Q`,
  },
  {
    heading: "D. Sudut Khusus pada Segitiga Siku-siku",
    content: `1. Sudut $30°$ dan $60°$
Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$:
- Sisi di depan sudut $30°$ = $\\frac{1}{2}$ sisi miring
- Sisi di depan sudut $60°$ = $\\frac{\\sqrt{3}}{2}$ sisi miring

2. Sudut $45°$
Pada segitiga siku-siku sama kaki dengan sudut $45°$, $45°$, dan $90°$:
- Kedua sisi tegak sama panjang
- Sisi miring = $\\sqrt{2}$ kali sisi tegak`,
  },
  {
    heading: "E. Tripel Pythagoras",
    content: `Tripel Pythagoras adalah 3 bilangan asli yang memenuhi teorema Pythagoras.\n\nTripel dasar yang sering muncul:\n- 3, 4, 5 (dan kelipatannya: 6,8,10 ; 9,12,15 ; ...)\n- 5, 12, 13 (dan kelipatannya: 10,24,26 ; ...)\n- 7, 24, 25\n- 8, 15, 17\n- 9, 40, 41`,
  },
];

// ─── Latihan Soal — 30 soal merata: 10 PG · 10 PGK · 10 PGKBS ──────────────
// Pola susunan: PG (ganjil/1,4,7,...) · PGK (2,5,8,...) · PGKBS (3,6,9,...)

const latihanDasarTka: LatihanSoal[] = [
  // ── SOAL 1 — PG ────────────────────────────────────────────────────────────
  {
    no: 1,
    type: "pg",
    soal: "Diketahui sebuah segitiga siku-siku dengan panjang dua sisi tegaknya 6 cm dan 8 cm. Panjang sisi miringnya adalah ...",
    options: ["A. 10 cm", "B. 12 cm", "C. 14 cm", "D. 15 cm"],
    jawaban: "A",
    pembahasan: "Gunakan Teorema Pythagoras:\n$c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100$\n$c = \\sqrt{100} = 10$ cm → Jawaban A",
  },

  // ── SOAL 2 — PGK ───────────────────────────────────────────────────────────
  {
    no: 2,
    type: "pgk",
    soal: "Suatu segitiga mempunyai sisi-sisi 5 cm, 12 cm, dan 13 cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "$5^2 + 12^2 = 13^2$",
      "Segitiga tersebut adalah segitiga siku-siku",
      "Luas segitiga tersebut adalah 30 cm²",
      "Keliling segitiga tersebut adalah 25 cm",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (2) dan (3) saja",
      "C. (1), (2), dan (3)",
      "D. Semua benar",
    ],
    jawaban: "C",
    pembahasan: "(1) $5^2 + 12^2 = 25 + 144 = 169 = 13^2$ ✓ BENAR\n(2) Karena $5^2+12^2=13^2$, segitiga siku-siku di sudut berhadapan 13 cm ✓ BENAR\n(3) Luas = $\\frac{1}{2} \\times 5 \\times 12 = 30$ cm² ✓ BENAR\n(4) Keliling = $5+12+13 = 30$ cm ≠ 25 cm ✗ SALAH\nPernyataan benar: (1), (2), dan (3) → Jawaban C",
  },

  // ── SOAL 3 — PGKBS ─────────────────────────────────────────────────────────
  {
    no: 3,
    type: "pgkbs",
    soal: "Tentukan benar (B) atau salah (S) untuk setiap pernyataan berikut tentang Teorema Pythagoras!",
    pernyataan: [
      "Pada segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi tegaknya",
      "Tripel (6, 8, 10) memenuhi Teorema Pythagoras karena $6^2 + 8^2 = 10^2$",
      "Sisi miring suatu segitiga siku-siku adalah sisi yang paling pendek",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) Teorema Pythagoras: $c^2 = a^2 + b^2$ → BENAR\n(2) $6^2+8^2 = 36+64 = 100 = 10^2$ → BENAR\n(3) Sisi miring (hipotenusa) adalah sisi yang TERPANJANG, bukan terpendek → SALAH",
  },

  // ── SOAL 4 — PG ────────────────────────────────────────────────────────────
  {
    no: 4,
    type: "pg",
    soal: "Panjang hipotenusa segitiga siku-siku adalah 13 cm dan salah satu sisi tegaknya 5 cm. Panjang sisi tegak yang lain adalah ...",
    options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    jawaban: "C",
    pembahasan: "$b^2 = c^2 - a^2 = 13^2 - 5^2 = 169 - 25 = 144$\n$b = \\sqrt{144} = 12$ cm → Jawaban C",
  },

  // ── SOAL 5 — PGK ───────────────────────────────────────────────────────────
  {
    no: 5,
    type: "pgk",
    soal: "Perhatikan pernyataan berikut tentang tripel Pythagoras!",
    pernyataan: [
      "(3, 4, 5) adalah tripel Pythagoras",
      "(5, 12, 13) adalah tripel Pythagoras",
      "(6, 8, 12) adalah tripel Pythagoras",
      "(8, 15, 17) adalah tripel Pythagoras",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (1), (2), dan (4)",
      "D. Semua benar",
    ],
    jawaban: "C",
    pembahasan: "(1) $3^2+4^2 = 9+16 = 25 = 5^2$ ✓ BENAR\n(2) $5^2+12^2 = 25+144 = 169 = 13^2$ ✓ BENAR\n(3) $6^2+8^2 = 36+64 = 100 \\neq 144 = 12^2$ ✗ SALAH\n(4) $8^2+15^2 = 64+225 = 289 = 17^2$ ✓ BENAR\nPernyataan benar: (1), (2), dan (4) → Jawaban C",
  },

  // ── SOAL 6 — PGKBS ─────────────────────────────────────────────────────────
  {
    no: 6,
    type: "pgkbs",
    soal: "Titik $A(1, 2)$ dan $B(4, 6)$ berada pada bidang koordinat Kartesius. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Jarak AB = 5 satuan",
      "Jarak AB = 25 satuan",
      "Selisih koordinat $x$ titik A dan B adalah 3",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "(1) $|AB| = \\sqrt{(4-1)^2+(6-2)^2} = \\sqrt{9+16} = \\sqrt{25} = 5$ satuan → BENAR\n(2) Jarak AB = 5 satuan, bukan 25 → SALAH\n(3) Selisih koordinat $x$: $4-1 = 3$ → BENAR",
  },

  // ── SOAL 7 — PG ────────────────────────────────────────────────────────────
  {
    no: 7,
    type: "pg",
    soal: "Sebuah tangga yang panjangnya 10 m bersandar pada tembok. Kaki tangga berjarak 6 m dari tembok. Tinggi yang dicapai tangga pada tembok adalah ...",
    options: ["A. 4 m", "B. 6 m", "C. 8 m", "D. 10 m"],
    jawaban: "C",
    pembahasan: "Tinggi$^2 = $ tangga$^2 - $ jarak$^2 = 10^2 - 6^2 = 100 - 36 = 64$\nTinggi $= \\sqrt{64} = 8$ m → Jawaban C",
  },

  // ── SOAL 8 — PGK ───────────────────────────────────────────────────────────
  {
    no: 8,
    type: "pgk",
    soal: "Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$ serta panjang sisi miring 24 cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Panjang sisi di depan sudut $30°$ adalah 12 cm",
      "Panjang sisi di depan sudut $60°$ adalah $12\\sqrt{3}$ cm",
      "Keliling segitiga adalah $(36 + 12\\sqrt{3})$ cm",
      "Luas segitiga adalah 144 cm²",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2), (3), dan (4)",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "Sisi miring = 24 cm\n(1) Sisi depan 30° = $\\frac{1}{2} \\times 24 = 12$ cm ✓ BENAR\n(2) Sisi depan 60° = $\\frac{\\sqrt{3}}{2} \\times 24 = 12\\sqrt{3}$ cm ✓ BENAR\n(3) Keliling = $24 + 12 + 12\\sqrt{3} = 36 + 12\\sqrt{3}$ cm ✓ BENAR\n(4) Luas = $\\frac{1}{2} \\times 12 \\times 12\\sqrt{3} = 72\\sqrt{3}$ cm² $\\neq 144$ cm² ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 9 — PGKBS ─────────────────────────────────────────────────────────
  {
    no: 9,
    type: "pgkbs",
    soal: "Sebuah segitiga mempunyai sisi-sisi $a$, $b$, dan $c$ dengan $c$ adalah sisi terpanjang. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Jika $c^2 = a^2 + b^2$, segitiga tersebut adalah segitiga siku-siku",
      "Jika $c^2 > a^2 + b^2$, segitiga tersebut adalah segitiga lancip",
      "Jika $c^2 < a^2 + b^2$, segitiga tersebut adalah segitiga lancip",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "(1) Ini adalah bunyi Teorema Pythagoras → BENAR\n(2) Jika $c^2 > a^2+b^2$ maka segitiga TUMPUL, bukan lancip → SALAH\n(3) Jika $c^2 < a^2+b^2$ maka segitiga LANCIP → BENAR",
  },

  // ── SOAL 10 — PG ───────────────────────────────────────────────────────────
  {
    no: 10,
    type: "pg",
    soal: "Jarak antara titik $P(1, 2)$ dan titik $Q(4, 6)$ pada bidang koordinat Kartesius adalah ...",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 7 satuan"],
    jawaban: "C",
    pembahasan: "$|PQ| = \\sqrt{(4-1)^2+(6-2)^2} = \\sqrt{3^2+4^2} = \\sqrt{9+16} = \\sqrt{25} = 5$ satuan → Jawaban C",
  },

  // ── SOAL 11 — PGK ──────────────────────────────────────────────────────────
  {
    no: 11,
    type: "pgk",
    soal: "Suatu belah ketupat ABCD mempunyai diagonal $AC = 10$ cm dan $BD = 24$ cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Panjang sisi belah ketupat = 13 cm",
      "Keliling belah ketupat = 52 cm",
      "Luas belah ketupat = 120 cm²",
      "Panjang sisi belah ketupat = 15 cm",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (2) dan (3) saja",
      "C. (1), (2), dan (3)",
      "D. Semua benar",
    ],
    jawaban: "C",
    pembahasan: "Setengah diagonal: $AO = 5$ cm, $BO = 12$ cm\n(1) Sisi = $\\sqrt{5^2+12^2} = \\sqrt{25+144} = \\sqrt{169} = 13$ cm ✓ BENAR\n(2) Keliling = $4 \\times 13 = 52$ cm ✓ BENAR\n(3) Luas = $\\frac{1}{2} \\times 10 \\times 24 = 120$ cm² ✓ BENAR\n(4) Sisi = 13 cm, bukan 15 cm ✗ SALAH\n→ Jawaban C",
  },

  // ── SOAL 12 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 12,
    type: "pgkbs",
    soal: "Segitiga siku-siku sama kaki mempunyai kedua sisi tegak masing-masing sepanjang $a$ cm. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Sudut-sudut segitiga adalah 45°, 45°, dan 90°",
      "Panjang sisi miring = $a\\sqrt{2}$ cm",
      "Jika $a = 5$ cm, luas segitiga = 25 cm²",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) Segitiga siku-siku sama kaki selalu memiliki sudut 45°-45°-90° → BENAR\n(2) $c^2 = a^2+a^2 = 2a^2$, jadi $c = a\\sqrt{2}$ → BENAR\n(3) Luas = $\\frac{1}{2} \\times 5 \\times 5 = 12{,}5$ cm², bukan 25 cm² → SALAH",
  },

  // ── SOAL 13 — PG ───────────────────────────────────────────────────────────
  {
    no: 13,
    type: "pg",
    soal: "Suatu segitiga mempunyai sisi-sisi 8 cm, 15 cm, dan 20 cm. Jenis segitiga tersebut ditinjau dari sudutnya adalah ...",
    options: [
      "A. Segitiga lancip",
      "B. Segitiga siku-siku",
      "C. Segitiga tumpul",
      "D. Segitiga sama kaki",
    ],
    jawaban: "C",
    pembahasan: "Sisi terpanjang: $c = 20$ cm\n$c^2 = 400$\n$a^2+b^2 = 8^2+15^2 = 64+225 = 289$\nKarena $c^2 = 400 > 289 = a^2+b^2$ → Segitiga TUMPUL → Jawaban C",
  },

  // ── SOAL 14 — PGK ──────────────────────────────────────────────────────────
  {
    no: 14,
    type: "pgk",
    soal: "Empat titik koordinat: $A(0,0)$, $B(3,0)$, $C(3,4)$, dan $D(0,4)$. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Jarak $AC = 5$ satuan",
      "Jarak $BD = 5$ satuan",
      "Bangun ABCD adalah persegi panjang",
      "Panjang diagonal ABCD = 7 satuan",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2) dan (4) saja",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "(1) $|AC| = \\sqrt{(3-0)^2+(4-0)^2} = \\sqrt{9+16} = 5$ satuan ✓ BENAR\n(2) $|BD| = \\sqrt{(0-3)^2+(4-0)^2} = \\sqrt{9+16} = 5$ satuan ✓ BENAR\n(3) AB=3, BC=4, CD=3, DA=4, semua sudut 90° → persegi panjang ✓ BENAR\n(4) Diagonal = 5 satuan ≠ 7 satuan ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 15 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 15,
    type: "pgkbs",
    soal: "Suatu belah ketupat mempunyai diagonal 16 cm dan 12 cm. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Panjang sisi belah ketupat = 10 cm",
      "Keliling belah ketupat = 40 cm",
      "Luas belah ketupat = 48 cm²",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Setengah diagonal: 8 cm dan 6 cm\n(1) Sisi = $\\sqrt{8^2+6^2} = \\sqrt{64+36} = \\sqrt{100} = 10$ cm → BENAR\n(2) Keliling = $4 \\times 10 = 40$ cm → BENAR\n(3) Luas = $\\frac{1}{2} \\times 16 \\times 12 = 96$ cm², bukan 48 cm² → SALAH",
  },

  // ── SOAL 16 — PG ───────────────────────────────────────────────────────────
  {
    no: 16,
    type: "pg",
    soal: "Keliling belah ketupat ABCD dengan panjang diagonal $p = 16$ cm dan $q = 12$ cm adalah ...",
    options: ["A. 20 cm", "B. 28 cm", "C. 40 cm", "D. 48 cm"],
    jawaban: "C",
    pembahasan: "Setengah diagonal: 8 cm dan 6 cm\nSisi = $\\sqrt{8^2+6^2} = \\sqrt{64+36} = \\sqrt{100} = 10$ cm\nKeliling = $4 \\times 10 = 40$ cm → Jawaban C",
  },

  // ── SOAL 17 — PGK ─────────────��────────────────────────────────────────────
  {
    no: 17,
    type: "pgk",
    soal: "Segitiga ABC siku-siku di B dengan $AB = 15$ cm dan $BC = 20$ cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Panjang $AC = 25$ cm",
      "Luas $\\triangle ABC = 150$ cm²",
      "Keliling $\\triangle ABC = 60$ cm",
      "Sudut terbesar di $\\triangle ABC$ adalah sudut A",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (2) dan (3) saja",
      "C. (1), (2), dan (3)",
      "D. Semua benar",
    ],
    jawaban: "C",
    pembahasan: "(1) $AC = \\sqrt{15^2+20^2} = \\sqrt{225+400} = \\sqrt{625} = 25$ cm ✓ BENAR\n(2) Luas = $\\frac{1}{2} \\times 15 \\times 20 = 150$ cm² ✓ BENAR\n(3) Keliling = $15+20+25 = 60$ cm ✓ BENAR\n(4) Sudut terbesar adalah sudut B (siku-siku = 90°), bukan sudut A ✗ SALAH\n→ Jawaban C",
  },

  // ── SOAL 18 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 18,
    type: "pgkbs",
    soal: "Sebuah kapal berlayar ke arah timur sejauh 12 km, lalu ke arah utara sejauh 5 km. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Lintasan kapal membentuk segitiga siku-siku",
      "Jarak langsung dari titik awal ke posisi akhir adalah 13 km",
      "Kapal harus berlayar sejauh 20 km untuk kembali ke titik awal melalui jalur langsung",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) Arah timur dan utara saling tegak lurus → membentuk segitiga siku-siku → BENAR\n(2) Jarak = $\\sqrt{12^2+5^2} = \\sqrt{144+25} = \\sqrt{169} = 13$ km → BENAR\n(3) Jarak langsung = 13 km, bukan 20 km → SALAH",
  },

  // ── SOAL 19 — PG ───────────────────────────────────────────────────────────
  {
    no: 19,
    type: "pg",
    soal: "Sebuah persegi panjang mempunyai panjang 15 cm dan lebar 8 cm. Panjang diagonalnya adalah ...",
    options: ["A. 14 cm", "B. 15 cm", "C. 17 cm", "D. 23 cm"],
    jawaban: "C",
    pembahasan: "Diagonal = $\\sqrt{15^2+8^2} = \\sqrt{225+64} = \\sqrt{289} = 17$ cm → Jawaban C",
  },

  // ── SOAL 20 — PGK ──────────────────────────────────────────────────────────
  {
    no: 20,
    type: "pgk",
    soal: "Diketahui tiga titik: $P(0,0)$, $Q(6,0)$, dan $R(6,8)$ pada bidang koordinat. Perhatikan pernyataan berikut!",
    pernyataan: [
      "$PQ = 6$ satuan",
      "$QR = 8$ satuan",
      "$PR = 10$ satuan",
      "$\\triangle PQR$ adalah segitiga tumpul",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2) dan (4) saja",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "(1) $PQ = |6-0| = 6$ satuan ✓ BENAR\n(2) $QR = |8-0| = 8$ satuan ✓ BENAR\n(3) $PR = \\sqrt{6^2+8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$ satuan ✓ BENAR\n(4) $6^2+8^2 = 10^2$ → $\\triangle PQR$ adalah segitiga SIKU-SIKU, bukan tumpul ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 21 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 21,
    type: "pgkbs",
    soal: "Seorang anak berdiri 9 m dari pangkal tiang bendera yang tingginya 12 m. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Jarak dari anak ke puncak tiang adalah 15 m",
      "(9, 12, 15) merupakan tripel Pythagoras",
      "Jarak anak ke puncak tiang = jarak ke pangkal + tinggi tiang",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) Jarak = $\\sqrt{9^2+12^2} = \\sqrt{81+144} = \\sqrt{225} = 15$ m → BENAR\n(2) $(9,12,15) = 3 \\times (3,4,5)$ → tripel Pythagoras → BENAR\n(3) Jarak ke puncak ≠ $9+12 = 21$ m; harus dihitung dengan Teorema Pythagoras → SALAH",
  },

  // ── SOAL 22 — PG ───────────────────────────────────────────────────────────
  {
    no: 22,
    type: "pg",
    soal: "Segitiga siku-siku sama kaki dengan panjang masing-masing sisi tegak 7 cm. Panjang sisi miringnya adalah ...",
    options: [
      "A. $7$ cm",
      "B. $7\\sqrt{2}$ cm",
      "C. $7\\sqrt{3}$ cm",
      "D. $14$ cm",
    ],
    jawaban: "B",
    pembahasan: "Sisi miring = $\\sqrt{7^2+7^2} = \\sqrt{49+49} = \\sqrt{98} = 7\\sqrt{2}$ cm → Jawaban B",
  },

  // ── SOAL 23 — PGK ──────────────────────────────────────────────────────────
  {
    no: 23,
    type: "pgk",
    soal: "Suatu segitiga siku-siku sama kaki mempunyai panjang sisi miring $10\\sqrt{2}$ cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Panjang sisi tegak = 10 cm",
      "Sudut-sudut segitiga adalah 45°, 45°, dan 90°",
      "Luas segitiga = 50 cm²",
      "Keliling segitiga = 30 cm",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2) dan (4) saja",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "Sisi tegak = $\\frac{10\\sqrt{2}}{\\sqrt{2}} = 10$ cm\n(1) Sisi tegak = 10 cm ✓ BENAR\n(2) Segitiga siku-siku sama kaki → 45°-45°-90° ✓ BENAR\n(3) Luas = $\\frac{1}{2} \\times 10 \\times 10 = 50$ cm² ✓ BENAR\n(4) Keliling = $10+10+10\\sqrt{2} = 20+10\\sqrt{2}$ cm $\\neq 30$ cm ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 24 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 24,
    type: "pgkbs",
    soal: "Diketahui segitiga dengan sisi 5 cm, 12 cm, dan 13 cm. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Segitiga tersebut adalah segitiga siku-siku",
      "Luas segitiga = 60 cm²",
      "Keliling segitiga = 30 cm",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "(1) $5^2+12^2 = 25+144 = 169 = 13^2$ → siku-siku → BENAR\n(2) Luas = $\\frac{1}{2} \\times 5 \\times 12 = 30$ cm², bukan 60 cm² → SALAH\n(3) Keliling = $5+12+13 = 30$ cm → BENAR",
  },

  // ── SOAL 25 — PG ───────────────────────────────────────────────────────────
  {
    no: 25,
    type: "pg",
    soal: "Titik $R(x, 0)$ terletak pada sumbu-$x$ dan berjarak 5 satuan dari titik $S(1, 4)$. Nilai $x$ yang memenuhi adalah ...",
    options: [
      "A. $x = 3$ atau $x = -1$",
      "B. $x = 4$ atau $x = -2$",
      "C. $x = 5$ atau $x = -3$",
      "D. $x = 6$ atau $x = -4$",
    ],
    jawaban: "B",
    pembahasan: "$|RS|^2 = (x-1)^2+(0-4)^2 = 25$\n$(x-1)^2+16 = 25$\n$(x-1)^2 = 9$\n$x-1 = \\pm 3$\n$x = 4$ atau $x = -2$ → Jawaban B",
  },

  // ── SOAL 26 — PGK ──────────────────────────────────────────────────────────
  {
    no: 26,
    type: "pgk",
    soal: "Sebuah tangga sepanjang 17 m bersandar pada tembok dengan kaki tangga berjarak 8 m dari tembok. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Tinggi yang dicapai tangga pada tembok = 15 m",
      "(8, 15, 17) merupakan tripel Pythagoras",
      "Jika kaki tangga digeser hingga berjarak 15 m dari tembok, tinggi yang dicapai = 8 m",
      "Luas segitiga yang dibentuk tangga, tembok, dan tanah = 30 m²",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2) dan (4) saja",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "(1) Tinggi = $\\sqrt{17^2-8^2} = \\sqrt{289-64} = \\sqrt{225} = 15$ m ✓ BENAR\n(2) $8^2+15^2 = 64+225 = 289 = 17^2$ ✓ BENAR\n(3) Tinggi = $\\sqrt{17^2-15^2} = \\sqrt{289-225} = \\sqrt{64} = 8$ m ✓ BENAR\n(4) Luas = $\\frac{1}{2} \\times 8 \\times 15 = 60$ m², bukan 30 m² ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 27 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 27,
    type: "pgkbs",
    soal: "Dua titik $A(2, 1)$ dan $B(8, 9)$ berada di bidang koordinat Kartesius. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Jarak AB = 10 satuan",
      "Titik tengah AB adalah $(5, 5)$",
      "Jarak dari titik asal $O(0,0)$ ke $A(2,1)$ adalah $\\sqrt{3}$ satuan",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) $|AB| = \\sqrt{(8-2)^2+(9-1)^2} = \\sqrt{36+64} = \\sqrt{100} = 10$ satuan → BENAR\n(2) Titik tengah = $\\left(\\frac{2+8}{2}, \\frac{1+9}{2}\\right) = (5, 5)$ → BENAR\n(3) $|OA| = \\sqrt{2^2+1^2} = \\sqrt{5}$ satuan, bukan $\\sqrt{3}$ → SALAH",
  },

  // ── SOAL 28 — PG ───────────────────────────────────────────────────────────
  {
    no: 28,
    type: "pg",
    soal: "Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$ serta panjang sisi miring 20 cm, panjang sisi di depan sudut $60°$ adalah ...",
    options: [
      "A. $10$ cm",
      "B. $10\\sqrt{2}$ cm",
      "C. $10\\sqrt{3}$ cm",
      "D. $20\\sqrt{3}$ cm",
    ],
    jawaban: "C",
    pembahasan: "Sisi di depan sudut $60°$ = $\\frac{\\sqrt{3}}{2} \\times$ sisi miring = $\\frac{\\sqrt{3}}{2} \\times 20 = 10\\sqrt{3}$ cm → Jawaban C",
  },

  // ── SOAL 29 — PGK ──────────────────────────────────────────────────────────
  {
    no: 29,
    type: "pgk",
    soal: "Perhatikan pernyataan berikut tentang jenis segitiga berdasarkan panjang sisinya!",
    pernyataan: [
      "Segitiga dengan sisi 9 cm, 40 cm, dan 41 cm adalah segitiga siku-siku",
      "Segitiga dengan sisi 6 cm, 7 cm, dan 10 cm adalah segitiga tumpul",
      "Segitiga dengan sisi 4 cm, 5 cm, dan 6 cm adalah segitiga lancip",
      "Segitiga dengan sisi 5 cm, 6 cm, dan 8 cm adalah segitiga siku-siku",
    ],
    options: [
      "A. (1) dan (2) saja",
      "B. (1), (2), dan (3)",
      "C. (2) dan (4) saja",
      "D. Semua benar",
    ],
    jawaban: "B",
    pembahasan: "(1) $9^2+40^2 = 81+1600 = 1681 = 41^2$ → siku-siku ✓ BENAR\n(2) $6^2+7^2 = 85 < 100 = 10^2$ → $c^2 > a^2+b^2$ → tumpul ✓ BENAR\n(3) $4^2+5^2 = 41 > 36 = 6^2$ → $c^2 < a^2+b^2$ → lancip ✓ BENAR\n(4) $5^2+6^2 = 61 \\neq 64 = 8^2$ → bukan siku-siku ✗ SALAH\n→ Jawaban B",
  },

  // ── SOAL 30 — PGKBS ────────────────────────────────────────────────────────
  {
    no: 30,
    type: "pgkbs",
    soal: "Sebuah persegi panjang mempunyai panjang 24 cm dan lebar 7 cm. Tentukan benar (B) atau salah (S)!",
    pernyataan: [
      "Panjang diagonal persegi panjang = 25 cm",
      "Keliling persegi panjang = 62 cm",
      "Luas persegi panjang = 196 cm²",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "(1) Diagonal = $\\sqrt{24^2+7^2} = \\sqrt{576+49} = \\sqrt{625} = 25$ cm → BENAR\n(2) Keliling = $2 \\times (24+7) = 2 \\times 31 = 62$ cm → BENAR\n(3) Luas = $24 \\times 7 = 168$ cm², bukan 196 cm² → SALAH",
  },
];

const latihanDiagram = (ariaLabel: string, children: React.ReactNode) => (
  <svg
    viewBox="0 0 360 210"
    role="img"
    aria-label={ariaLabel}
    className="mx-auto my-3 h-auto w-full max-w-sm rounded-lg border border-border bg-background p-3 text-foreground"
  >
    {children}
  </svg>
);

const rightTriangleDiagram = ({
  ariaLabel,
  left,
  bottom,
  hypotenuse,
  caption,
  topAngle,
  endAngle,
}: {
  ariaLabel: string;
  left: string;
  bottom: string;
  hypotenuse: string;
  caption?: string;
  topAngle?: string;
  endAngle?: string;
}) => latihanDiagram(ariaLabel, <>
  <path d="M75 150 L75 38 L285 150 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M75 136 h14 v14" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <text x="34" y="100" fontSize="14" fill="currentColor">{left}</text>
  <text x="175" y="174" textAnchor="middle" fontSize="14" fill="currentColor">{bottom}</text>
  <text x="194" y="83" textAnchor="middle" fontSize="14" fill="currentColor">{hypotenuse}</text>
  {topAngle && <text x="62" y="57" fontSize="12" fill="currentColor">{topAngle}</text>}
  {endAngle && <text x="250" y="140" fontSize="12" fill="currentColor">{endAngle}</text>}
  {caption && <text x="180" y="202" textAnchor="middle" fontSize="12" fill="currentColor">{caption}</text>}
</>);

const generalTriangleDiagram = (
  ariaLabel: string,
  left: string,
  bottom: string,
  right: string,
  caption: string,
) => latihanDiagram(ariaLabel, <>
  <path d="M66 70 L294 70 L150 166 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <text x="102" y="111" fontSize="14" fill="currentColor">{left}</text>
  <text x="180" y="91" textAnchor="middle" fontSize="14" fill="currentColor">{bottom}</text>
  <text x="250" y="119" fontSize="14" fill="currentColor">{right}</text>
  <text x="180" y="198" textAnchor="middle" fontSize="12" fill="currentColor">{caption}</text>
</>);

const coordinateDiagram = (
  ariaLabel: string,
  firstPoint: string,
  secondPoint: string,
  horizontal: string,
  vertical: string,
  distance: string,
  cornerLabel?: string,
) => latihanDiagram(ariaLabel, <>
  <path d="M55 158 H310 M75 180 V25" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
  <path d="M92 140 H264 V57" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" opacity=".75" />
  <path d="M92 140 L264 57" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M250 57 h14 v14" fill="none" stroke="currentColor" strokeWidth="1.4" />
  <circle cx="92" cy="140" r="4" fill="currentColor" />
  <circle cx="264" cy="57" r="4" fill="currentColor" />
  <text x="80" y="162" textAnchor="end" fontSize="13" fill="currentColor">{firstPoint}</text>
  <text x="271" y="53" fontSize="13" fill="currentColor">{secondPoint}</text>
  <text x="178" y="158" textAnchor="middle" fontSize="12" fill="currentColor">{horizontal}</text>
  <text x="270" y="105" fontSize="12" fill="currentColor">{vertical}</text>
  <text x="165" y="88" textAnchor="middle" fontSize="12" fill="currentColor">{distance}</text>
  {cornerLabel && <text x="264" y="158" fontSize="12" fill="currentColor">{cornerLabel}</text>}
</>);

const rectangleDiagram = (
  ariaLabel: string,
  length: string,
  width: string,
  diagonal: string,
  caption?: string,
) => latihanDiagram(ariaLabel, <>
  <path d="M65 45 H290 V150 H65 Z M65 45 L290 150" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <text x="177" y="36" textAnchor="middle" fontSize="14" fill="currentColor">{length}</text>
  <text x="302" y="104" fontSize="14" fill="currentColor">{width}</text>
  <text x="190" y="82" textAnchor="middle" fontSize="14" fill="currentColor">{diagonal}</text>
  {caption && <text x="177" y="184" textAnchor="middle" fontSize="12" fill="currentColor">{caption}</text>}
</>);

const rhombusDiagram = (
  ariaLabel: string,
  diagonalVertical: string,
  diagonalHorizontal: string,
  side: string,
  caption?: string,
) => latihanDiagram(ariaLabel, <>
  <path d="M180 28 L300 100 L180 172 L60 100 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M180 28 V172 M60 100 H300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 4" />
  <path d="M174 100 h12 M180 94 v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <text x="185" y="48" fontSize="13" fill="currentColor">{diagonalVertical}</text>
  <text x="95" y="94" fontSize="13" fill="currentColor">{diagonalHorizontal}</text>
  <text x="240" y="62" fontSize="13" fill="currentColor">{side}</text>
  {caption && <text x="180" y="202" textAnchor="middle" fontSize="12" fill="currentColor">{caption}</text>}
</>);

const triplesDiagram = (ariaLabel: string, rows: Array<[string, string]>) => latihanDiagram(ariaLabel, <>
  {rows.map(([triple, result], index) => {
    const y = 42 + index * 36;
    return (
      <g key={triple}>
        <rect x="34" y={y - 19} width="292" height="28" rx="6" fill="currentColor" opacity=".06" />
        <text x="52" y={y} fontSize="14" fill="currentColor">{triple}</text>
        <text x="306" y={y} textAnchor="end" fontSize="13" fill="currentColor">{result}</text>
      </g>
    );
  })}
</>);

const ladderDiagram = (ariaLabel: string, ladder: string, base: string, height: string) => latihanDiagram(ariaLabel, <>
  <path d="M72 166 H292 M72 166 V35 M91 166 L274 43" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M72 152 h14 v14" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <path d="M94 160 l8 -7 M111 160 l8 -7 M128 160 l8 -7" stroke="currentColor" strokeWidth="1.5" />
  <text x="184" y="91" fontSize="14" fill="currentColor">{ladder}</text>
  <text x="178" y="187" textAnchor="middle" fontSize="14" fill="currentColor">{base}</text>
  <text x="37" y="102" fontSize="14" fill="currentColor">{height}</text>
</>);

const boatDiagram = (east: string, north: string, direct: string) => latihanDiagram("Rute kapal ke timur lalu ke utara membentuk segitiga siku-siku", <>
  <path d="M65 155 H270 V48 M65 155 L270 48" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M254 48 h16 v16" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <circle cx="65" cy="155" r="5" fill="currentColor" />
  <path d="M125 155 l-8 -5 v10 z M270 105 l-5 8 h10 z" fill="currentColor" />
  <text x="165" y="177" textAnchor="middle" fontSize="13" fill="currentColor">Timur {east}</text>
  <text x="279" y="104" fontSize="13" fill="currentColor">Utara {north}</text>
  <text x="157" y="89" textAnchor="middle" fontSize="13" fill="currentColor">{direct}</text>
</>);

const towerDiagram = () => latihanDiagram("Jarak anak ke puncak tiang bendera membentuk segitiga siku-siku", <>
  <path d="M55 162 H310 M250 162 V42 M105 162 L250 42" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <path d="M236 162 h14 v-14" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <circle cx="105" cy="145" r="6" fill="currentColor" />
  <path d="M105 151 v11 m-7 -5 h14" stroke="currentColor" strokeWidth="2" />
  <text x="175" y="180" textAnchor="middle" fontSize="14" fill="currentColor">9 m</text>
  <text x="258" y="105" fontSize="14" fill="currentColor">12 m</text>
  <text x="164" y="94" fontSize="14" fill="currentColor">15 m</text>
</>);

const coordinateSolutionsDiagram = () => latihanDiagram("Titik S dan dua kemungkinan posisi titik R pada sumbu x dengan jarak 5 satuan", <>
  <path d="M45 145 H315 M100 185 V28" fill="none" stroke="currentColor" strokeWidth="1.5" />
  <path d="M90 62 H222 V145 M90 62 L222 145 M90 62 L45 145" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" />
  <circle cx="90" cy="62" r="5" fill="currentColor" />
  <circle cx="222" cy="145" r="5" fill="currentColor" />
  <circle cx="45" cy="145" r="5" fill="currentColor" />
  <text x="76" y="54" fontSize="13" fill="currentColor">S(1,4)</text>
  <text x="222" y="166" textAnchor="middle" fontSize="13" fill="currentColor">R(4,0)</text>
  <text x="45" y="166" textAnchor="middle" fontSize="13" fill="currentColor">R(-2,0)</text>
  <text x="148" y="82" fontSize="13" fill="currentColor">5</text>
</>);

const midpointDiagram = () => latihanDiagram("Titik A dan B, jarak 10 satuan dan titik tengah (5,5)", <>
  <path d="M52 165 H315 M74 180 V25" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
  <path d="M115 145 L270 48" fill="none" stroke="currentColor" strokeWidth="2.5" />
  <circle cx="115" cy="145" r="5" fill="currentColor" />
  <circle cx="270" cy="48" r="5" fill="currentColor" />
  <circle cx="192" cy="96" r="5" fill="currentColor" />
  <text x="84" y="140" fontSize="13" fill="currentColor">A(2,1)</text>
  <text x="275" y="46" fontSize="13" fill="currentColor">B(8,9)</text>
  <text x="198" y="91" fontSize="13" fill="currentColor">M(5,5)</text>
  <text x="184" y="125" fontSize="13" fill="currentColor">AB = 10</text>
</>);

const latihanSvgMap: Record<string, React.ReactNode> = {
  "pythagoras-latihan-1": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku dengan sisi tegak 6 cm dan 8 cm serta sisi miring yang dicari", left: "6 cm", bottom: "8 cm", hypotenuse: "c = ?" }),
  "pythagoras-latihan-2": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku dengan sisi 5 cm, 12 cm, dan 13 cm", left: "5 cm", bottom: "12 cm", hypotenuse: "13 cm", caption: "5² + 12² = 13²" }),
  "pythagoras-latihan-3": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku umum dengan sisi a, b, dan c", left: "a", bottom: "b", hypotenuse: "c", caption: "c² = a² + b²" }),
  "pythagoras-latihan-4": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku dengan hipotenusa 13 cm, satu sisi 5 cm, dan sisi lain yang dicari", left: "5 cm", bottom: "?", hypotenuse: "13 cm" }),
  "pythagoras-latihan-5": triplesDiagram("Daftar empat kelompok bilangan untuk menentukan tripel Pythagoras", [["3, 4, 5", "Tripel"], ["5, 12, 13", "Tripel"], ["6, 8, 12", "Bukan"], ["8, 15, 17", "Tripel"]]),
  "pythagoras-latihan-6": coordinateDiagram("Titik A(1,2) dan B(4,6), dengan selisih koordinat 3 dan 4", "A(1,2)", "B(4,6)", "Δx = 3", "Δy = 4", "AB = 5"),
  "pythagoras-latihan-7": ladderDiagram("Tangga panjang 10 m bersandar pada tembok dengan jarak kaki 6 m", "10 m", "6 m", "h = ?"),
  "pythagoras-latihan-8": rightTriangleDiagram({ ariaLabel: "Segitiga 30, 60, 90 dengan hipotenusa 24 cm", left: "12 cm", bottom: "12√3 cm", hypotenuse: "24 cm", topAngle: "60°", endAngle: "30°" }),
  "pythagoras-latihan-9": generalTriangleDiagram("Segitiga dengan sisi c terpanjang untuk membandingkan kuadrat sisi", "a", "c terpanjang", "b", "Bandingkan c² dengan a² + b²"),
  "pythagoras-latihan-10": coordinateDiagram("Jarak titik P(1,2) dan Q(4,6) pada bidang koordinat", "P(1,2)", "Q(4,6)", "Δx = 3", "Δy = 4", "PQ = ?"),
  "pythagoras-latihan-11": rhombusDiagram("Belah ketupat dengan diagonal 10 cm dan 24 cm serta sisi 13 cm", "24 cm", "10 cm", "13 cm", "Diagonal saling membagi dua tegak lurus"),
  "pythagoras-latihan-12": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku sama kaki dengan sisi tegak a dan sisi miring a akar dua", left: "a cm", bottom: "a cm", hypotenuse: "a√2 cm", topAngle: "45°", endAngle: "45°" }),
  "pythagoras-latihan-13": generalTriangleDiagram("Segitiga sisi 8 cm, 15 cm, dan 20 cm untuk klasifikasi sudut", "8 cm", "20 cm", "15 cm", "20² > 8² + 15² (tumpul)"),
  "pythagoras-latihan-14": rectangleDiagram("Persegi panjang ABCD berukuran 3 kali 4 dengan diagonal 5", "3 satuan", "4 satuan", "AC = 5", "A(0,0), B(3,0), C(3,4), D(0,4)"),
  "pythagoras-latihan-15": rhombusDiagram("Belah ketupat dengan diagonal 16 cm dan 12 cm", "16 cm", "12 cm", "10 cm", "Sisi diperoleh dari setengah diagonal"),
  "pythagoras-latihan-16": rhombusDiagram("Belah ketupat dengan diagonal 16 cm dan 12 cm untuk menghitung keliling", "16 cm", "12 cm", "10 cm", "Keliling = 4 × sisi"),
  "pythagoras-latihan-17": rightTriangleDiagram({ ariaLabel: "Segitiga ABC siku-siku di B dengan AB 15 cm, BC 20 cm, dan AC 25 cm", left: "AB = 15", bottom: "BC = 20", hypotenuse: "AC = 25", caption: "Luas = 150 cm²; keliling = 60 cm" }),
  "pythagoras-latihan-18": boatDiagram("12 km", "5 km", "Jarak langsung = 13 km"),
  "pythagoras-latihan-19": rectangleDiagram("Persegi panjang dengan panjang 15 cm, lebar 8 cm, dan diagonal dicari", "15 cm", "8 cm", "d = ?"),
  "pythagoras-latihan-20": coordinateDiagram("Segitiga PQR pada bidang koordinat dengan PQ 6, QR 8, dan PR 10", "P(0,0)", "R(6,8)", "PQ = 6", "QR = 8", "PR = 10", "Q(6,0)"),
  "pythagoras-latihan-21": towerDiagram(),
  "pythagoras-latihan-22": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku sama kaki dengan kedua sisi tegak 7 cm", left: "7 cm", bottom: "7 cm", hypotenuse: "c = ?", topAngle: "45°", endAngle: "45°" }),
  "pythagoras-latihan-23": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku sama kaki dengan sisi miring 10 akar dua cm", left: "10 cm", bottom: "10 cm", hypotenuse: "10√2 cm", topAngle: "45°", endAngle: "45°" }),
  "pythagoras-latihan-24": rightTriangleDiagram({ ariaLabel: "Segitiga siku-siku dengan sisi 5 cm, 12 cm, dan 13 cm", left: "5 cm", bottom: "12 cm", hypotenuse: "13 cm", caption: "Luas = 30 cm²; keliling = 30 cm" }),
  "pythagoras-latihan-25": coordinateSolutionsDiagram(),
  "pythagoras-latihan-26": triplesDiagram("Dua segitiga yang dibentuk oleh tangga 17 m: sisi 8, 15, 17 dan 15, 8, 17", [["Tangga 17 m, alas 8 m", "tinggi 15 m"], ["Tangga 17 m, alas 15 m", "tinggi 8 m"], ["Luas untuk alas 8", "60 m²"]]),
  "pythagoras-latihan-27": midpointDiagram(),
  "pythagoras-latihan-28": rightTriangleDiagram({ ariaLabel: "Segitiga 30, 60, 90 dengan hipotenusa 20 cm", left: "10 cm", bottom: "10√3 cm", hypotenuse: "20 cm", topAngle: "60°", endAngle: "30°" }),
  "pythagoras-latihan-29": triplesDiagram("Perbandingan empat kelompok sisi segitiga untuk klasifikasi sudut", [["9, 40, 41", "Siku-siku"], ["6, 7, 10", "Tumpul"], ["4, 5, 6", "Lancip"], ["5, 6, 8", "Bukan siku-siku"]]),
  "pythagoras-latihan-30": rectangleDiagram("Persegi panjang berukuran 24 cm kali 7 cm dengan diagonal 25 cm", "24 cm", "7 cm", "d = 25 cm", "Keliling = 62 cm"),
};

const latihanDenganDiagram = latihanDasarTka.map((soal) => ({
  ...soal,
  soalSvg: `pythagoras-latihan-${soal.no}`,
}));

const TeoremaPage = () => (
  <TKAPemantapanLayout
    title="TEOREMA PYTHAGORAS"
    materiSections={materiSections}
    contohSoal={contohSoal}
    soalSvgMap={{ ...contohSvgMap, ...latihanSvgMap }}
    latihanDasar={latihanDenganDiagram}
    imageScale="half"
    imageScaleExceptQuestionNo={13}
  />
);

export default TeoremaPage;
