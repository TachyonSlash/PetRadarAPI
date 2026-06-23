import 'dotenv/config';
import * as env from 'env-var';

// Prefer DATABASE_URL in production (Neon/Railway). Fall back to individual vars locally.
const parseDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
        const url = new URL(databaseUrl);

        return {
            url: databaseUrl,
            host: url.hostname,
            port: url.port ? Number(url.port) : 5432,
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            name: url.pathname.replace(/^\//, ''),
            ssl: true,
        };
    }

    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const name = process.env.DB_NAME;

    if (!host || !port || !user || !password || !name) {
        throw new Error(
            'Missing database configuration. Set DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME.',
        );
    }

    return {
        host,
        port: Number(port),
        user,
        password,
        name,
        ssl: false,
    };
};

const dbConfig = parseDatabaseConfig();

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : null;

export const envs = {
    PORT: env.get("PORT").required().asPortNumber(),
    MAILER_EMAIL: env.get("MAILER_EMAIL").required().asString(),
    MAILER_PASSWORD: env.get("MAILER_PASSWORD").required().asString(),
    MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
    MAPBOX_TOKEN: env.get("MAPBOX_TOKEN").required().asString(),
    DB_HOST: dbConfig.host,
    DB_NAME: dbConfig.name,
    DB_PORT: dbConfig.port,
    DB_USER: dbConfig.user,
    DB_PASSWORD: dbConfig.password,
    DB_URL: dbConfig.url,
    DB_SSL: env.get("DB_SSL").asBool() || dbConfig.ssl,
    APPINSIGHTS_CONNECTION_STRING: env.get("APPINSIGHTS_CONNECTION_STRING").asString(),
    REDIS_HOST: redisHost,
    REDIS_PORT: redisPort,
};