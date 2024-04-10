import { copyable, divider, heading, panel, text } from "@metamask/snaps-sdk";
import {
  fetchAllNotifs,
  getCurrentTimestamp,
  getModifiedSnapState,
  notifyInMetamaskApp,
  updateSnapState,
} from "../../utils";
import { LatestSnapState } from "../../types";

/**
 * Executes a cron job to handle notifications.
 * Fetches notifications for all subscribed addresses,
 * updates the Snap state, and displays alerts or in-app notifications as needed.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
export const notifyCronJob = async (state: LatestSnapState): Promise<void> => {
  try {
    // Fetch notifications for all subscribed addresses
    const allNotifs = await fetchAllNotifs();

    // Display an alert for new notifications
    if (allNotifs.length > 0) {

        // show popup
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

        const newState = {
          ...state,
          popupsTimestamp: [...state.popupsTimestamp, getCurrentTimestamp()],
        };
        await updateSnapState({
          newState: newState,
          encrypted: false,
        });
      
    }

    const snapState = await getModifiedSnapState({ encrypted: false });
    const currentTimeStamp = getCurrentTimestamp();
    await updateSnapState({
      newState: snapState,
      encrypted: false,
    });

    // Display in-app notifications
    await notifyInMetamaskApp(allNotifs);
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in notifCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
