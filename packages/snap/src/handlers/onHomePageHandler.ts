import type { OnHomePageHandler } from '@metamask/snaps-sdk';
import { panel, heading, divider, text } from '@metamask/snaps-sdk';
import { InternalError } from '@metamask/snaps-sdk';

async function getFC() {
  const response = await fetch("https://farnotify-site.vercel.app/api/trending-casts");
  return response.json();
}

export const onHomePage: OnHomePageHandler = async () => {
  return getFC().then(trending => {
    // format data! 
    try {
      const casts = trending.casts;
      console.log(casts);
      const feed = casts.map((cast: any) => [
        divider(),
        text(cast.text),
        text(`_by ${cast.author.username}_ [ ](https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 11)})`),
      ]);

      return {
        content: panel([
          heading("Hourly Trending casts on Farcaster"),
          ...feed.flat(),
          divider(),
        ])
      };
    }
    catch (error) {
      console.log(error);
      throw new InternalError();
    }
  });
};
