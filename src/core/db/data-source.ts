import { envs } from "src/config/envs";
import { DataSourceOptions, DataSource } from "typeorm";
import { FoundPet } from "../entities/found-pet.entity"; 
import { LostPet } from "../entities/lost-pet.entity";

export const dataSourceOptions : DataSourceOptions = {
    type: 'postgres',
    url: envs.DB_URL,
    host: envs.DB_URL ? undefined : envs.DB_HOST,
    database: envs.DB_URL ? undefined : envs.DB_NAME,
    username: envs.DB_URL ? undefined : envs.DB_USER,
    password: envs.DB_URL ? undefined : envs.DB_PASSWORD,
    port: envs.DB_URL ? undefined : envs.DB_PORT,
    entities: [FoundPet, LostPet],
    synchronize: false,
    migrations: ["dist/core/db/migrations/*"],
    ssl: envs.DB_SSL ? { rejectUnauthorized: false } : false,
}

export const dataSource = new DataSource(dataSourceOptions);