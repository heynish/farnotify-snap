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
    const url = 'https://farnotify-site.vercel.app/api/trending-mints';
    const response = await fetchGet<any>(url); // Use any or define a specific interface for the raw response

    // Transform the raw response to match the INotification shape
    const feeds: INotification[] = response.map((item: any) => ({
      address: item.address,
      blockchain: item.blockchain,
      name: item.token.name,
      supply: item.token.totalSupply || "", // Assuming you want to default to an empty string if totalSupply is not present
      url: item.elementURL,
    }));

    return { feeds }; // Return the transformed data wrapped in an object
  } catch (error) {
    console.error(`Error in getFeeds:`, error);
    throw error;
  }
};