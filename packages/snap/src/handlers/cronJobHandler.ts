import { OnCronjobHandler } from "@metamask/snaps-sdk";
<<<<<<< HEAD
import { garbageCollectCronJob, notifyCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";
import { getModifiedSnapState } from "../utils";

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });

    switch (request.method as SnapCronJobMethod) {
      case SnapCronJobMethod.NotifyCronJob:
        await notifyCronJob(state);
        break;
      case SnapCronJobMethod.GarbageCollectCronJob:
        await garbageCollectCronJob(state);
=======
import { notifyCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  try {

    switch (request.method as SnapCronJobMethod) {
      case SnapCronJobMethod.NotifyCronJob:
        await notifyCronJob();
>>>>>>> 8cfae92 (commit fix)
        break;
      default:
        throw new Error("Method not found.");
    }
  } catch (error) {
    console.error("Error in onCronjob:", error);
    throw error;
  }
};
