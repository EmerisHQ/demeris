# emeris-web

Web version of the Emeris cryptocurrency portal.

## Develop

```
npm ci
npm run serve
```

## Build

```
npm run build
```

## Desktop

## Develop

```
npm run electron:dev
```

This will run a development server of the frontend and Electron and it's main thread independent.

### Build

```
npm run app:build
```

The installation file will be located in `dist_electron`.

To only rebuild Electron related code:

```
npm run compile:electron && npm run electron:builder
```
