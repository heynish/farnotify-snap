import { OnCronjobHandler } from "@metamask/snaps-sdk";
import { notifyCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  try {

    switch (request.method as SnapCronJobMethod) {
      case SnapCronJobMethod.NotifyCronJob:
        await notifyCronJob();
        break;
      default:
        throw new Error("Method not found.");
    }
  } catch (error) {
    console.error("Error in onCronjob:", error);
    throw error;
  }
};
