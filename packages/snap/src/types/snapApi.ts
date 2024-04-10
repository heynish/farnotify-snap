import { LatestSnapState } from "./snapState";

export type ApiRequestParams =
  | AddAddressRequestParams
  | RemoveAddressRequestParams
  | TogglePopupRequestParams;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseRequestParams {}

export interface AddAddressRequestParams extends BaseRequestParams {
  address: string;
}

export interface SnoozeDurationRequestParams extends BaseRequestParams {
  snoozeDuration: string;
}

export interface RemoveAddressRequestParams extends BaseRequestParams {
  address: string;
}

export type TogglePopupRequestParams = BaseRequestParams

export interface ChannelOptinRequestParams extends BaseRequestParams {
  channelAddress: string;
}

export type ApiParams = {
    state: LatestSnapState;
    requestParams: ApiRequestParams;
}

export enum SnapRpcMethod {
  Welcome = "farnotify_welcome",
}

export enum SnapCronJobMethod {
  NotifyCronJob = "notifyCronJob", 
  GarbageCollectCronJob = "garbageCollectCronJob",
}
