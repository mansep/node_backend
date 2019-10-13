# API NodeJS

Ejemplo de API con NodeJS + Express + Ecmascript 6 + Mongoose

## Instalación

```bash
npm install
```
## Comandos

```bash
npm start       # Inciar servicio
npm run dev     # Inciar servicio con nodemon
npm run format  # Ordena y optimiza código
npm run lint    # Revisa reglas lint
```

## Docker

```bash
docker build -t node-app . --build-arg MONGO_URL=mongodb://domain:port/db --build-arg PORT=3000 --build-arg JWT_SECRET=jwtsecret   
```