import 'dotenv/config';
import * as env from 'env-var';

// Parse DATABASE_URL if provided (for Neon/Railway), otherwise use individual vars
const parseDatabaseUrl = () => {
    const databaseUrl = env.get("DATABASE_URL").asString();
    if (databaseUrl) {
        const url = new URL(databaseUrl);
        return {
            host: url.hostname,
            port: url.port ? parseInt(url.port) : 5432,
            user: url.username,
            password: url.password,
            name: url.pathname.slice(1), // remove leading /
        };
    }
    // Fallback to individual env vars
    return {
        host: env.get("DB_HOST").required().asString(),
        port: env.get("DB_PORT").required().asPortNumber(),
        user: env.get("DB_USER").required().asString(),
        password: env.get("DB_PASSWORD").required().asString(),
        name: env.get("DB_NAME").required().asString(),
    };
};

const dbConfig = parseDatabaseUrl();

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
    DB_SSL: env.get("DB_SSL").asBool() || process.env.DATABASE_URL?.includes('postgresql://') ? true : false,
    APPINSIGHTS_CONNECTION_STRING: env.get("APPINSIGHTS_CONNECTION_STRING").asString(),
    REDIS_HOST: env.get("REDIS_HOST").required().asString(),
    REDIS_PORT: env.get("REDIS_PORT").required().asPortNumber(),
};