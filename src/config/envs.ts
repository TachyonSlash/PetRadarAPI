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

const parseRedisConfig = () => {
    const redisUrl = process.env.REDIS_URL || process.env.REDIS_PUBLIC_URL;

    if (redisUrl) {
        const url = new URL(redisUrl);

        return {
            url: redisUrl,
            host: url.hostname,
            port: url.port ? Number(url.port) : 6379,
            username: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            tls: url.protocol === 'rediss:',
        };
    }

    const redisHost = process.env.REDIS_HOST || process.env.REDISHOST;
    const redisPort = process.env.REDIS_PORT || process.env.REDISPORT;
    const redisPassword = process.env.REDIS_PASSWORD || process.env.REDISPASSWORD;
    const redisUser = process.env.REDIS_USER || process.env.REDISUSER;

    if (!redisHost || !redisPort) {
        return {
            host: null,
            port: null,
            username: redisUser || null,
            password: redisPassword || null,
            url: null,
            tls: false,
        };
    }

    return {
        host: redisHost,
        port: Number(redisPort),
        username: redisUser || null,
        password: redisPassword || null,
        url: null,
        tls: false,
    };
};

const redisConfig = parseRedisConfig();

export const envs = {
    PORT: env.get("PORT").required().asPortNumber(),
    MAILER_EMAIL: env.get("MAILER_EMAIL").required().asString(),
    MAILER_PASSWORD: process.env.MAILER_PASSWORD ?? '',
    MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN ?? '',
    MAPBOX_TOKEN: env.get("MAPBOX_TOKEN").required().asString(),
    DB_HOST: dbConfig.host,
    DB_NAME: dbConfig.name,
    DB_PORT: dbConfig.port,
    DB_USER: dbConfig.user,
    DB_PASSWORD: dbConfig.password,
    DB_URL: dbConfig.url,
    DB_SSL: env.get("DB_SSL").asBool() || dbConfig.ssl,
    APPINSIGHTS_CONNECTION_STRING: env.get("APPINSIGHTS_CONNECTION_STRING").asString(),
    REDIS_HOST: redisConfig.host,
    REDIS_PORT: redisConfig.port,
    REDIS_URL: redisConfig.url,
    REDIS_USERNAME: redisConfig.username,
    REDIS_PASSWORD: redisConfig.password,
    REDIS_TLS: redisConfig.tls,
};