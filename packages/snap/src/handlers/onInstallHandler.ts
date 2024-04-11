import type { OnInstallHandler } from "@metamask/snaps-sdk";
import { heading, panel, text } from "@metamask/snaps-sdk";

export const onInstall: OnInstallHandler = async () => {
    await snap.request({
        method: "snap_dialog",
        params: {
            type: "alert",
            content: panel([
                heading("Thank you for installing FarNotify"),
                text(
                    "You'll get hourly notifications on trending mints among Farcaster users.",
                ),
                text(
                    "Also you can view hourly trending casts on Farcaster. To view,",
                ),
                text(
                    "Open MetaMask->Snaps->FarNotify",
                ),
            ]),
        },
    });
};