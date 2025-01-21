<div align="center">
<img width="150" alt="saleor-app-template" src="https://user-images.githubusercontent.com/4006792/215185065-4ef2eda4-ca71-48cc-b14b-c776e0b491b6.png">
</div>

<div align="center">
  <h1>Saleor App Template</h1>
</div>

<div align="center">
  <p>Bare-bones boilerplate for writing Saleor Apps with Next.js.</p>
</div>

<div align="center">
  <a href="https://saleor.io/">Website</a>
  <span> | </span>
  <a href="https://docs.saleor.io/docs/3.x/">Docs</a>
  <span> | </span>
    <a href="https://githubbox.com/saleor/saleor-app-template">CodeSandbox</a>
</div>

### What is Saleor App

Saleor App is the fastest way of extending Saleor with custom logic using [asynchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/asynchronous-webhooks) and [synchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks/key-concepts) webhooks (and vast Saleor's API). In most cases, creating an App consists of two tasks:

- Writing webhook's code executing your custom logic.
- Developing configuration UI to be displayed in Saleor Dashboard via specialized view (designated in the App's manifest).

### What's included?

- 🚀 Communication between Saleor instance and Saleor App
- 📖 Manifest with webhooks using custom query

### Why Next.js

You can use any preferred technology to create Saleor Apps, but Next.js is among the most efficient for two reasons. The first is the simplicity of maintaining your API endpoints/webhooks and your apps' configuration React front-end in a single, well-organized project. The second reason is the ease and quality of local development and deployment.

### Learn more about Apps

[Apps guide](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

## Development

### Requirements

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Saleor CLI](https://docs.saleor.io/docs/3.x/cli) - optional, but recommended

### With CLI

The easiest way to set up a Saleor app is by using the Saleor CLI.

[Saleor CLI](https://github.com/saleor/saleor-cli) is designed to save you from the repetitive chores around Saleor development, including creating Apps. It will take the burden of spawning new apps locally, connecting them with Saleor environments, and establishing a tunnel for local development in seconds.

[Full Saleor CLI reference](https://docs.saleor.io/docs/3.x/cli)

If you don't have a (free developer) Saleor Cloud account, create one with the following command:

```
saleor register
```

You will also have to login with:

```
saleor login
```

Now you're ready to create your first App:

```
saleor app template [your-app-name]
```

In this step, Saleor CLI will:

- clone this repository to the specified folder
- install dependencies
- ask you whether you'd like to install the app in the selected Saleor environment
- create `.env` file
- start the app in development mode

Having your app ready, the final thing you want to establish is a tunnel with your Saleor environment. Go to your app's directory first and run:

```
saleor app tunnel
```

Your local application should be available now to the outside world (Saleor instance) for accepting all the events via webhooks.

A quick note: the next time you come back to your project, it is enough to launch your app in a standard way (and then launch your tunnel as described earlier):

```
pnpm dev
```

### Without CLI

1. Install the dependencies by running:

```
pnpm install
```

2. Start the local server with:

```
pnpm dev
```

3. Expose local environment using tunnel:
   Use tunneling tools like [localtunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/).

4. Install the application in your dashboard:

If you use Saleor Cloud or your local server is exposed, you can install your app by following this link:

```
[YOUR_SALEOR_DASHBOARD_URL]/apps/install?manifestUrl=[YOUR_APP_TUNNEL_MANIFEST_URL]
```

This template host manifest at `/api/manifest`

You can also install application using GQL or command line. Follow the guide [how to install your app](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installation-using-graphql-api) to learn more.

### Generated schema and typings

Commands `build` and `dev` would generate schema and typed functions using Saleor's GraphQL endpoint. Commit the `generated` folder to your repo as they are necessary for queries and keeping track of the schema changes.

[Learn more](https://www.graphql-code-generator.com/) about GraphQL code generation.

### Storing registration data - APL

During the registration process, Saleor API passes the auth token to the app. With this token App can query Saleor API with privileged access (depending on requested permissions during the installation).
To store this data, app-template use a different [APL interfaces](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md).

The choice of the APL is made using the `APL` environment variable. If the value is not set, FileAPL is used. Available choices:

- `file`: no additional setup is required. Good choice for local development. It can't be used for multi tenant-apps or be deployed (not intended for production)
- `upstash`: use [Upstash](https://upstash.com/) Redis as storage method. Free account required. It can be used for development and production and supports multi-tenancy. Requires `UPSTASH_URL` and `UPSTASH_TOKEN` environment variables to be set

If you want to use your own database, you can implement your own APL. [Check the documentation to read more.](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)

# Saleor Westpac Payment App

This Saleor app integrates Westpac PayWay API for payment processing in your Saleor store.

## Features

- Process payments through Westpac PayWay API
- Handle payment confirmations and status updates
- Process refunds
- Secure handling of payment information
- Integration with Saleor's order workflow

## Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy the environment variables template:

```bash
cp .env.example .env
```

4. Configure your environment variables:

- `NEXT_PUBLIC_SALEOR_API_URL`: Your Saleor API endpoint
- `WESTPAC_API_KEY`: Your Westpac PayWay API key
- `WESTPAC_SECRET_KEY`: Your Westpac PayWay secret key
- `WESTPAC_MERCHANT_ID`: Your Westpac merchant ID
- `ENCRYPTION_KEY`: Your encryption key for securing sensitive data

## Deployment to Vercel

### Prerequisites

1. A Vercel account
2. The Vercel CLI installed:

```bash
npm i -g vercel
```

### Steps to Deploy

1. Login to Vercel:

```bash
vercel login
```

2. Configure environment variables in Vercel:

   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_SALEOR_API_URL
     WESTPAC_API_KEY
     WESTPAC_SECRET_KEY
     WESTPAC_MERCHANT_ID
     ENCRYPTION_KEY
     APL=vercel
     ```

3. Deploy to Vercel:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

### Post-Deployment Configuration

1. Update your Saleor Dashboard with the new app URL:

   - Go to your Saleor Dashboard
   - Navigate to Apps
   - Update the app's webhook URLs to point to your Vercel deployment

2. Verify the integration:
   - Make a test payment
   - Check webhook deliveries
   - Verify payment status updates

### Monitoring and Logs

- View deployment logs: `vercel logs`
- Monitor deployment: Vercel Dashboard > Deployments
- Check application logs: Vercel Dashboard > Settings > Logs

## Local Development

1. Start the development server:

```bash
pnpm dev
```

2. Run tests:

```bash
pnpm test
```

## API Endpoints

### Process Payment

- **POST** `/api/payments/process`
- Request body:

```json
{
  "orderNumber": "string",
  "transactionType": "payment" | "preauth",
  "principalAmount": number,
  "currency": "string",
  "customerEmail": "string",
  "paymentMethod": {
    "type": "creditCard" | "paypal",
    "card": {
      "number": "string",
      "expiryMonth": "string",
      "expiryYear": "string",
      "securityCode": "string"
    }
  },
  "redirectUrl": "string"
}
```

### Get Payment Status

- **POST** `/api/payments/confirm`
- Request body:

```json
{
  "paymentId": "string"
}
```

### Process Refund

- **POST** `/api/payments/refund`
- Request body:

```json
{
  "transactionId": "string",
  "amount": number,
  "reason": "string",
  "customerEmail": "string"
}
```

## Security

- All API keys and sensitive data are stored securely in Vercel environment variables
- PCI DSS compliance is maintained by not storing any card details
- All payment data is transmitted securely over HTTPS
- CORS headers are properly configured
- Webhook signatures are verified

## Support

For issues and feature requests, please create an issue in the repository.

## License

See [LICENSE](LICENSE) file for details.
