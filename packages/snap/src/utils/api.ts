export const fetchGet = async <T>(url: string): Promise<T> => {
  try {
    /* const response = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }); */

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.json() as T;
  } catch (error) {
    console.error(`Error in fetchGet for ${url}:`, error);
    throw error;
  }
};

export const fetchPost = async <T>(url: string, body: T): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.json() as T;
  } catch (error) {
    console.error(`Error in fetchPost for ${url}:`, error);
    throw error;
  }
};
