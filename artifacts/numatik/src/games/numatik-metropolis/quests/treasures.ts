export type TreasureVehicle = "car" | "boat" | "plane" | "helicopter" | "any";

export interface Treasure {
  id: number;
  name: { id: string; en: string; ja: string };
  district: { id: string; en: string; ja: string };
  x: number;
  y: number;
  z: number;
  vehicle: TreasureVehicle;
  clue: { id: string; en: string; ja: string };
}

export const TREASURES: Treasure[] = [
  {
    id: 0,
    name: { id: "Menara Awan", en: "Cloud Tower", ja: "雲の塔" },
    district: { id: "Pusat Kota", en: "Downtown", ja: "中心街" },
    x: 118,
    y: 0,
    z: -82,
    vehicle: "helicopter",
    clue: {
      id: "Ikuti gedung tertinggi di pusat kota; cahaya peti berada di atap.",
      en: "Find the tallest tower downtown; the chest glows on its roof.",
      ja: "中心街で一番高い塔を探そう。宝箱は屋上で光っているよ。",
    },
  },
  {
    id: 1,
    name: { id: "Pulau Riak", en: "Ripple Isle", ja: "さざ波島" },
    district: { id: "Sungai Kota", en: "City River", ja: "街の川" },
    x: 8,
    y: 0,
    z: 188,
    vehicle: "boat",
    clue: {
      id: "Sungai membelah kota. Cari pulau kecil di antara dua jembatan.",
      en: "The river divides the city. Look for a small island between two bridges.",
      ja: "川が街を分けているよ。二つの橋の間にある小島を探そう。",
    },
  },
  {
    id: 2,
    name: { id: "Hanggar Ceria", en: "Bright Hangar", ja: "ひだまり格納庫" },
    district: { id: "Bandara", en: "Airfield", ja: "飛行場" },
    x: 356,
    y: 0,
    z: -292,
    vehicle: "plane",
    clue: {
      id: "Cari landasan di pinggir kota, lalu periksa hanggar biru.",
      en: "Find the runway at the edge of town, then check the blue hangar.",
      ja: "街のはずれの滑走路へ行き、青い格納庫を見てみよう。",
    },
  },
  {
    id: 3,
    name: { id: "Gang Pabrik", en: "Workshop Lane", ja: "工房通り" },
    district: { id: "Kawasan Industri", en: "Workshop District", ja: "工業地区" },
    x: -286,
    y: 0,
    z: 244,
    vehicle: "car",
    clue: {
      id: "Di kawasan industri, belok ke gang di antara dua gudang bata.",
      en: "In the industrial district, turn into the lane between two brick warehouses.",
      ja: "工業地区で、レンガ倉庫二棟の間の路地へ曲がろう。",
    },
  },
  {
    id: 4,
    name: { id: "Puncak Pinus", en: "Pine Lookout", ja: "松の展望台" },
    district: { id: "Perbukitan", en: "Green Hills", ja: "緑の丘" },
    x: 430,
    y: 0,
    z: 224,
    vehicle: "any",
    clue: {
      id: "Naiki bukit hijau di timur. Peti menunggu di dekat menara pandang.",
      en: "Climb the green hill to the east. The chest waits near the lookout.",
      ja: "東の緑の丘を登ろう。展望台のそばに宝箱があるよ。",
    },
  },
];
