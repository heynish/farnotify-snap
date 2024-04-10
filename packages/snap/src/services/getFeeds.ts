import { fetchGet } from "../utils";

export interface INotification {
  address: string;
  blockchain: string;
  name: string;
  supply: string;
  url: string;
}

export interface IFeeds {
  feeds: INotification[];
}

export const getFeeds = async (): Promise<IFeeds> => {
  try {
    const url = ''
    const response = await fetchGet<IFeeds>(url);
    return response;
  } catch (error) {
    console.error(`Error in getFeeds:`, error);
    throw error;
  }
};
