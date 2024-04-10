import { divider, heading, panel } from "@metamask/snaps-sdk";
import {
  fetchAllNotifs,
  notifyInMetamaskApp,
} from "../../utils";

export const notifyCronJob = async (): Promise<void> => {
  try {
    const allNotifs = await fetchAllNotifs();

    if (allNotifs.length > 0) {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("You have a new notification!"),
              divider(),
            ]),
          },
        });
    }
    await notifyInMetamaskApp(allNotifs);
  } catch (error) {
    console.error("Error in notifCronJob:", error);
    throw error;
  }
};
