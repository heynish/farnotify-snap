import { Feed, getFeeds } from "../services";
import { getModifiedSnapState, updateSnapState } from "./snapStateUtils";
import { convertEpochToMilliseconds, formatTimestamp } from "./time";
import { INotification, INotificationGroup } from "../types";

/**
 * Retrieves notifications for a specific address.
 * @param address The Ethereum address to retrieve notifications for.
 * @returns An array of notifications.
 */
export const getNotifications = async ({
  userAddress,
  page = 1,
  limit = 10,
}: {
  userAddress: string;
  page?: number;
  limit?: number;
}) => {
  try {
      const feeds = await getFeeds({ userAddress, page, limit });
      return feeds.feeds;
  } catch (err) {
    console.error(`Error in getNotifications for ${userAddress}:`, err);
    throw err;
  }
};

/**
 * Fetches notifications for all stored addresses.
 * @returns An array of notifications for all stored addresses.
 */
export const fetchAllNotifs = async (): Promise<INotification[]> => {
  try {
    const addresses = await fetchAddress();
    let notifs: INotification[] = [];

    if (addresses.length === 0) {
      return notifs;
    }

    const promises = addresses.map((address) => filterNotifications(address));
    const results = await Promise.all(promises);
    notifs = results.reduce((acc, curr) => acc.concat(curr), []);

    return notifs;
  } catch (error) {
    console.error("Error in fetchAllAddrNotifs:", error);
    throw error;
  }
};

/**
 * Formats the notifs from Feed format into INotification format to be used in snap
 * @param address - The Ethereum address.
 * @returns An array of formatted notifs.
 */
export const getFormattedNotifList = (
  notifList: Feed[],
  address: string
): INotification[] => {
  const formattedNotifList = notifList.map((notif) => {
    const emoji = notif.payload.data.aimg ? `📸` : `🔔`;
    const { newText, timestamp } = convertText(notif.payload.data.amsg);
    const msg = emoji + notif.payload.data.app + ": " + newText;

    const notificationBody = notif.payload.data.aimg
      ? `📸 ${newText}`
      : newText;

    return {
      address: address,
      channelName: notif.payload.data.app,
      epoch: convertEpochToMilliseconds(notif.payload.data.epoch),
      notification: {
        body: notificationBody,
        title: notif.payload.notification.title,
      },
      msgData: {
        timestamp: timestamp,
        popupMsg: notificationBody,
        inAppNotifMsg: msg.slice(0, 47),
        cta: notif.payload.data.acta,
      },
    };
  });
  return formattedNotifList;
};

/**
 * Converts text by removing special formatted tags and extracts a timestamp if present.
 * It returns the cleaned text and the first extracted timestamp in a formatted string.
 * 
 * @param {string} text - The input text containing special tags and a timestamp.
 * @returns {{ newText: string; timestamp: number | null }} An object containing:
 *           - `newText`: The text with all special formatted tags removed.
 *           - `timestamp`: The first extracted timestamp formatted as a string, or null if not present.
 * @throws Will throw an error if the function encounters an unexpected issue.
 */
const convertText = (
  text: string
): { newText: string; timestamp: string } => {
  try {
    let newText = text;
    let extractedTimestamp: number | null = null;

    // Remove special formatted tags like [d:...], [s:...], [t:...]
    const tagRegex = /\[(d|s|t):([^\]]+)\]/g;
    newText = newText.replace(tagRegex, (match, tag, value) => value);

    // Extract and remove the timestamp, if present
    const timestampRegex = /\[timestamp:(.*?)\]/;
    let timeStamp: string;
    newText = newText.replace(timestampRegex, (match, timestamp) => {
      const timestampValue = parseInt(timestamp);
      // If the timestamp is valid and hasn't been extracted yet, format and save it
      if (!isNaN(timestampValue) && extractedTimestamp === null) {
        extractedTimestamp = timestampValue * 1000; // Convert to milliseconds
        timeStamp = formatTimestamp(extractedTimestamp); // Format using a separate function
        return "";
      } else {
        return "";
      }
    });

    // Return the cleaned text and the formatted timestamp
    return { newText, timestamp: timeStamp };
  } catch (error) {
    console.error("Error in convertText:", error);
    throw error;
  }
};

/**
 * Adds in App notifications in Metamask.
 * @param notifs Array of notifications to be in proper format.
 */
export const notifyInMetamaskApp = async (notifs: INotification[]) => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });

    // if rate limit is 5, then why maxToAdd is 4?
    // notifCronJob runs every minute, let's say it'd run at 1:00 AM and 1:01 AM
    // first cron job that runs at 1:00 AM, runs and do some api calls in filterNotifications and few operations
    // it takes few seconds and then it proceeds to notify, if more than 5 were there, then 5 notifs are added in metamask inApp
    // now, 2nd cronjob runs at 1:01 AM, it also does few operations and then proceeds to notify
    // due to timings mismatch of operations and number of feeds api calls, time between last call of notify in first cronjob and first call of notify in second cronjob
    // was throwing error sometimes, and sometimes it was working (tested with multiple instances and found out time difference in few milliseconds)
    // to resolve this, a timestamp could've been added to monitor this time or a queue implementation but it's a overkill
    // so, final way was to assign maxToAdd as 4 and a sleep of 2 seconds after a notify call
    const maxToAdd = 3; // snap_notify is rate-limited to max 5 per minute

    const pendingNotifsCount = state.pendingInAppNotifs.length;

    // Determine how many notifications to add from pendingInAppNotifs
    const pendingNotifsToAdd = Math.min(pendingNotifsCount, maxToAdd);

    // Add pending notifications from pendingInAppNotifs
    for (let i = 0; i < pendingNotifsToAdd; i++) {
      const msg = state.pendingInAppNotifs.shift(); // Remove the first pending notification
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg.message,
        },
      });
      await sleep(3000);
    }

    // Calculate the remaining number of notifications to add
    const remainingToAdd = maxToAdd - pendingNotifsToAdd;

    // Add notifications from notifs array
    for (let i = 0; i < remainingToAdd && i < notifs.length; i++) {
      const msg = notifs[i].msgData.inAppNotifMsg;
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg,
        },
      });
      await sleep(3000);
    }

    // Add remaining notifications to pendingInAppNotifs if any
    if (notifs.length > remainingToAdd) {
      const remainingNotifs = notifs.slice(remainingToAdd);
      state.pendingInAppNotifs.push(
        ...remainingNotifs.map((notif) => {
          return {
            address: notif.address,
            message: notif.msgData.inAppNotifMsg,
            timestamp: notif.epoch,
          };
        })
      );
    }

    await updateSnapState({
      newState: state,
      encrypted: false,
    });
  } catch (error) {
    console.error("Error in notifyInMetamaskApp:", error);
    throw error;
  }
};
