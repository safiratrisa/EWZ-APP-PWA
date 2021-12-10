declare global {
  interface Window {
    registration: any;
    workbok: any;
  }
}

import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { setListBestScore, getListBestScoreSync, delItemListBestScoreSync } from "./utils";

clientsClaim();
registerRoute(
  ({ request }) => {
    return request.url.includes("api/list-bestscore") && request.method === "GET";
  },
  async function (args) {
    console.log("get-list-best-score");
    const response = await fetch(args.event.request);
    const { data } = await response.clone().json();
    console.log("get-list-best-score_success");
    setListBestScore(data);
    return response;
  }
);

const updateEverySyncRanking = async () => {
  const url = "/api/list-bestscore";
  const data = await getListBestScoreSync();
  for (const [key, dt] of data) {
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(dt),
      });
      delItemListBestScoreSync(key);
    } catch (error) {
      console.log("sync-error", error);
    }
  }
};

self.addEventListener("sync", function (event: any) {
  console.log("[Serice worker] Background syncing...", event);
  if (event.tag === "sync-rangking") {
    console.log("[Service worker] Syncing new posts...");
    event.waitUntil(updateEverySyncRanking());
  }
});

let latestBest = "";
async function fetchData() {
  try {
    const { data } = await fetch("/api/latest-best").then((response) => response.json());

    if (!data.id) return;

    if (data.id !== latestBest) {
      latestBest = data.id;

      self.registration.showNotification("Record Broken", {
        body: `Rekor telah dipecahkan oleh ${data.name} dengan score ${data.score}`,
        icon: "/icon-192x192.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "vibration-sample",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

self.addEventListener("activate", (event) => {
  console.log("activate=", event);
  setInterval(fetchData, 2000);
});
