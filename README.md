# dcx issuer server

This project uses the [DCX Protocol](https://github.com/TBD54566975/incubation-tblend) to deploy a dcx issuer server.

The main function of this service is to provide Credential Manifests, and handlers for each manifest.

## Credential Manifests

This service uses [Credential Manifests](https://identity.foundation/credential-manifest/) to define the credentials required to get other credentials.

See the `/credentials-manifests` directory for the manifests provided by this service.

## Configuration

See the file `.env.example`

Create a new file `.env` to set the environment variables as needed or provide them at runtime.

## Running the service

```sh
npm install
npm run build
npm start
```
