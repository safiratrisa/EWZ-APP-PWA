import { clear, setMany, createStore, entries, del, set } from "idb-keyval";

const storeRangking = createStore("ewz-pwa", "ranking");
const storeRangkingSync = createStore("ewz-pwa-sync", "ranking");

export function setListBestScore(data: any[]) {
  clear().then(() => {
    const dataStore: any = data.map((item) => [item.id, item]);
    setMany(dataStore, storeRangking)
      .then(() => console.log("It worked!"))
      .catch((err) => console.log("It failed!", err));
  });
}

export async function addListBestScoreSync(data: any) {
  set(Math.random().toString(16).slice(2), data, storeRangkingSync);
}

export async function getListBestScoreSync() {
  return await entries(storeRangkingSync);
}

export async function delItemListBestScoreSync(key: any) {
  del(key, storeRangkingSync);
}
