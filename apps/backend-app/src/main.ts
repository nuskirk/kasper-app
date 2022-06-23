import app from './app';

import { Application } from 'express';
import { environment } from './environments/environment';

async function startServer(): Promise<Application> {
    const api: Application = await app.server();
    api.listen(environment.port, () => {
        console.log(`Listening on port ${environment.port}`);
    });

    return api;
}

startServer();

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});
