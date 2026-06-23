import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';

@Injectable()
export class CacheService {
    private readonly redis: Redis | null;

    constructor() {
        if (!envs.REDIS_URL && (!envs.REDIS_HOST || !envs.REDIS_PORT)) {
            console.warn('[CacheService] Redis variables are not configured, cache disabled');
            this.redis = null;
            return;
        }

        try {
            this.redis = envs.REDIS_URL
                ? new Redis(envs.REDIS_URL, {
                    connectTimeout: 2000,
                    retryStrategy: () => null, // Don't retry, fail fast
                    tls: envs.REDIS_TLS ? {} : undefined,
                })
                : new Redis({
                    host: envs.REDIS_HOST!,
                    port: envs.REDIS_PORT!,
                    username: envs.REDIS_USERNAME ?? undefined,
                    password: envs.REDIS_PASSWORD ?? undefined,
                    connectTimeout: 2000,
                    retryStrategy: () => null, // Don't retry, fail fast
                });
            this.redis.on('error', () => {
                console.warn('[CacheService] Redis connection failed, cache disabled');
            });
        } catch (error) {
            console.warn('[CacheService] Could not initialize Redis:', error);
            this.redis = null;
        }
    }

    async set(key: string, value: any) {
        if (!this.redis) return;
        try {
            const json = JSON.stringify(value);
            await this.redis.set(key, json);
        } catch (error) {
            console.warn('[CacheService] Failed to set cache:', error);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.redis) return null;
        try {
            const data = await this.redis.get(key);
            if (!data) return null;
            const object = JSON.parse(data) as T;
            return object;
        } catch (error) {
            console.warn('[CacheService] Failed to get cache:', error);
            return null;
        }
    }

    async delete(key: string) {
        if (!this.redis) return;
        try {
            await this.redis.del(key);
        } catch (error) {
            console.warn('[CacheService] Failed to delete cache:', error);
        }
    }
}
