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
