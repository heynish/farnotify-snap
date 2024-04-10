import { OnCronjobHandler } from "@metamask/snaps-sdk";
import { notifyCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";
import { getModifiedSnapState } from "../utils";

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });

    switch (request.method as SnapCronJobMethod) {
      case SnapCronJobMethod.NotifyCronJob:
        await notifyCronJob(state);
        break;
      default:
        throw new Error("Method not found.");
    }
  } catch (error) {
    console.error("Error in onCronjob:", error);
    throw error;
  }
};
