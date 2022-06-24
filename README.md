## Kasper App

### Development
```
cd kasper-app

docker build . -t my-base-image:nx-base

docker-compose -f docker-compose.yml up

docker exec -it backend-app sh

(inside docker container)
yarn db:migrate

Visit http://localhost:4900
```

## Stack
- Nx (https://nx.dev/)
- Express/TypeScript
- React/Typescript
- Database Prisma-Mysql (https://www.prisma.io/)
- Docker


We are using Nx to serve a monorepo workspace with 2 apps:
- backend-app: Express/Typescript

```
+-- /backend-app - Server API codebase
|   +-- /src
|   |   +-- /app
|   |   |  +-- app.interface.ts - define express app interface
|   |   |  +-- index.ts - define express app
|   |   +-- /modules
|   |   |  +-- /person
|   |   |  |  +-- /services - defines services to query database
|   |   |  |      +-- PersonService.interface.ts - defines service interface
|   |   |  |      +-- PersonService.ts - defines service to query database
|   |   |  |  +-- PersonRouter.ts - defines router to handle http request/response
|   |   |  +-- BaseRouter.ts - defines base router
|   |   |  +-- Router.interface.ts - defines base router interface
|   |   +-- /prisma
|   |   |  +-- /migrations - defines database migrations
|   |   |  +-- schema.prisma - defines database models/connections
|   |   +-- /environments
|   |   |  +-- environment.ts - defines environment variables
|   |   |  +-- environment.prod.ts - defines production environment variables for build
|   |   +-- main.ts - main file
```

- frontend-app: React/Typescript
+-- /frontend-app - React Client codebase
|   +-- /src
|   |   +-- /api  - defines api endpoint
|   |   +-- /app  - defines react app
|   |   +-- /components - defines components
|   |   +-- /environments - defines environment variables
|   |   +-- main.ts - main file
```
