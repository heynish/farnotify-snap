import { getFeeds } from "../services";
import { INotification } from "../services";

export const getNotifications = async () => {
  try {
      const feeds = await getFeeds();
      return feeds.feeds;
  } catch (err) {
    console.error(`Error in getNotifications:`, err);
    throw err;
  }
};


export const fetchAllNotifs = async (): Promise<INotification[]> => {
  try {
    let notifs: INotification[] = [];
      const fetchedNotifications = await getNotifications();
      if (fetchedNotifications.length === 0) {
        return [];
      }
    const promises = fetchedNotifications;
    notifs = await Promise.all(promises);
    return notifs;
  } catch (error) {
    console.error("Error in fetchAllAddrNotifs:", error);
    throw error;
  }
};


export const notifyInMetamaskApp = async (notifs: INotification[]) => {
  try {

    if(notifs && notifs.length>0){
    for (let i = 0; i < notifs.length; i++) {
      const msg = notifs[i]?.address || '';
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg,
        },
      });
    }
  }
  } catch (error) {
    console.error("Error in notifyInMetamaskApp:", error);
    throw error;
  }
};
