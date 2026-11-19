export type VehicleKind = "car" | "motorcycle" | "boat" | "plane" | "helicopter";

export interface VehicleOffer {
  id: VehicleKind;
  name: { id: string; en: string; ja: string };
  price: number;
  description: { id: string; en: string; ja: string };
}

export const VEHICLE_OFFERS: VehicleOffer[] = [
  { id: "car", name: { id: "Mobil Kota", en: "City Car", ja: "シティカー" }, price: 0, description: { id: "Kendaraan awal yang seimbang.", en: "A balanced starter vehicle.", ja: "バランスのよい初期車両。" } },
  { id: "motorcycle", name: { id: "Motor Lincah", en: "Swift Motorcycle", ja: "軽快なバイク" }, price: 80, description: { id: "Ringan dan mudah bermanuver.", en: "Light and nimble.", ja: "軽くて小回りがきく。" } },
  { id: "boat", name: { id: "Perahu Riak", en: "Ripple Boat", ja: "さざ波ボート" }, price: 140, description: { id: "Jelajahi sungai dan pulau.", en: "Explore the river and island.", ja: "川や小島を探検しよう。" } },
  { id: "plane", name: { id: "Pesawat Kecil", en: "Light Aircraft", ja: "小型飛行機" }, price: 220, description: { id: "Terbang dari landasan kota.", en: "Take off from the city runway.", ja: "街の滑走路から飛び立とう。" } },
  { id: "helicopter", name: { id: "Helikopter Kota", en: "City Helicopter", ja: "シティヘリコプター" }, price: 280, description: { id: "Terbang dan mendarat dengan mudah.", en: "Easy takeoffs and landings.", ja: "簡単に離着陸できる。" } },
];

export const WANTED_FINE = [0, 15, 30, 50, 75, 100];
