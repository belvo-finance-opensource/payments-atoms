# Belvo Biometric PIX - Web SDK playground

This playground was created to help you debug the [Webauthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) by using Belvo Biometric PIX Web SDK.

## Requirements

Make sure to have Node.js installed.

## Project Setup

As you may know, you need a SSL connection and a valid domain to be able to test the Webauthn API.

You need to install a tool called [Caddy](https://caddyserver.com/). Caddy will start a secure connection and a domain for you, so you will be able to go to <https://bio.localhost> and start using this playground.

You can learn how to install Caddy [here](https://caddyserver.com/docs/install).

### How to start the server

You first need to make sure you have installed all dependencies by running the following command:

```sh
npm install
```

After that, you can build the project with:

```sh
npm run build
```

And then, go to your `./dist` folder and run:

```sh
npx http-server
```

This command will start a web server for you serving locally the files inside the `./dist` folder.

After that, it's time to run Caddy. Open a new terminal window, go to the playground root folder (where the `Caddyfile` is located), and run the following command:

```sh
caddy run
```

You might need to open a new terminal window to allow caddy to create the certificates for you. You should run the following command (just one time) while having Caddy running:

```sh
caddy trust
```

That is all. You should now be able to navigate to <https://bio.localhost> and start playing around. Have fun!
