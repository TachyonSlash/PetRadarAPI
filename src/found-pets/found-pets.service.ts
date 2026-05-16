import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { FoundPetCDto } from 'src/core/models/foundPet.model';
import { LostPetCDto } from 'src/core/models/lostPet.model';
import { EmailService } from 'src/email/email.service';
import { EmailOptions } from 'src/core/models/email-options.model';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_FOUND_PETS = "found-pets:all";

@Injectable()
export class FoundPetsService {
    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService,
    ) {}

    async findAll() : Promise<FoundPet[]> {
        try {
            console.log("[FoundPetsService] Buscando mascotas encontradas en caché");
            const foundPetsObject = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);

            if(foundPetsObject && foundPetsObject.length > 0){
                console.log(`[FoundPetsService] Se encontraron ${foundPetsObject.length} mascotas en caché`);
                return foundPetsObject;
            }

            console.log("[FoundPetsService] No hay datos en caché, consultando BD");
            const result = await this.foundPetRepository.find();
            console.log(`[FoundPetsService] Se encontraron ${result.length} mascotas encontradas`);
            await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, result);
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createFoundPet(foundPet: FoundPetCDto): Promise<Boolean> {
        const newFoundPet = this.foundPetRepository.create({
            species: foundPet.species,
            size: foundPet.size,
            color: foundPet.color,
            breed: foundPet.breed,
            description: foundPet.description,
            photo_url: foundPet.photo_url,
            finder_name: foundPet.finder_name,
            finder_email: foundPet.finder_email,
            finder_phone: foundPet.finder_phone,
            location: {
                type: 'Point',
                coordinates: [foundPet.lon, foundPet.lat],
            },
            address: foundPet.address,
            found_date: new Date(foundPet.found_date),
        });

        await this.foundPetRepository.save(newFoundPet);
        await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

        // Buscar lost pets activas dentro de 500 metros usando ST_DWithin y cast a geography
        const matches = await this.lostPetRepository
            .createQueryBuilder('lost')
            .where('lost.is_active = true')
            .andWhere(
                'ST_DWithin(lost.location::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :distance)',
                { lon: foundPet.lon, lat: foundPet.lat, distance: 500 },
            )
            .getMany();

        // Si se encuentran coincidencias, enviar un correo por cada una
        for (const matched of matches) {
            const lostLocation = matched.location as unknown as { coordinates: [number, number] };
            const lostPetDto: LostPetCDto = {
                name: matched.name,
                species: matched.species,
                breed: matched.breed ?? '',
                color: matched.color,
                size: matched.size,
                description: matched.description,
                photo_url: matched.photo_url ?? '',
                owner_name: matched.owner_name,
                owner_email: matched.owner_email,
                owner_phone: matched.owner_phone,
                lat: lostLocation.coordinates[1],
                lon: lostLocation.coordinates[0],
                address: matched.address,
                lost_date: matched.lost_date,
            };

            const template = generateFoundPetEmailTemplate(foundPet, lostPetDto);
            const options: EmailOptions = {
                to: matched.owner_email,
                subject: 'Posible coincidencia: mascota encontrada cerca tuya',
                htmlBody: template,
            };
            await this.emailService.sendEmail(options);
        }
        return true;
    }
}
