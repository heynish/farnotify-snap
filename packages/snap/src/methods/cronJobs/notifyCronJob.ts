import { divider, heading, panel, text } from "@metamask/snaps-sdk";
import {
  fetchAllNotifs,
  notifyInMetamaskApp,
} from "../../utils";

export const notifyCronJob = async (): Promise<void> => {
  try {
    const allNotifs = await fetchAllNotifs();

    if (allNotifs.length > 0) {

      const feed = allNotifs.map((notifs: any) => [
        divider(),
        text(`**${notifs.name}**`),
        text(`_Blockchain_ ${notifs.blockchain}`),
        text(`_View on Element_ [ ](${notifs.url})`),
      ]);

        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Trending mints from the last hour"),
              ...feed.flat(),
              divider(),
            ])
          },
        });
    }
    //await notifyInMetamaskApp(allNotifs);
  } catch (error) {
    console.error("Error in notifCronJob:", error);
    throw error;
  }
};
