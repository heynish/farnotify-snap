import type { OnInstallHandler } from "@metamask/snaps-sdk";
import { heading, panel, text } from "@metamask/snaps-sdk";

export const onInstall: OnInstallHandler = async () => {
    await snap.request({
        method: "snap_dialog",
        params: {
            type: "alert",
            content: panel([
                heading("Thank you for installing my Snap"),
                text(
                    "To use this Snap, visit the companion dapp at [metamask.io](https://metamask.io).",
                ),
            ]),
        },
    });
};