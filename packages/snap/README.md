
# FarNotify Snap

A MetaMask Snap for delivering Farcaster trending mints notifications hourly and display hourly trending casts on Farcaster directly on MetaMask.


## Run Locally

Clone the project

```bash
  git clone https://github.com/heynish/farnotify-snap.git
```

Go to the snap directory

```bash
  cd snap
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```

Go to the dapp directory

```bash
  cd site
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run dev
```

## Using the npm package
 Make the following changes in the dapp
 - Change all occurrences of ```defaultSnapOrigin``` from ```local:http://localhost:8080``` to ```npm:push-v1```  in the farnotify-site codebase

## Permissions asked by the Snap
- Periodic actions (Cron job) : This include sending notifications every hour to the wallet
- Dialog Boxes : This includes Popups for showing notifications on screen, initial screen and snap home page.
- Internet Access : The snap has internet access and can make api calls using fetch()



