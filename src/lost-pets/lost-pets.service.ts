import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { LostPetCDto } from 'src/core/models/lostPet.model';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_LOST_PETS = "lost-pets:all";

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly cacheService: CacheService,
    ) {}

    async findAll(): Promise<LostPet[]> {
        try {
            console.log("[LostPetsService] Buscando mascotas perdidas en caché");
            const lostPetsObject = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);

            if(lostPetsObject && lostPetsObject.length > 0){
                console.log(`[LostPetsService] Se encontraron ${lostPetsObject.length} mascotas en caché`);
                return lostPetsObject;
            }

            console.log("[LostPetsService] No hay datos en caché, consultando BD");
            const result = await this.lostPetRepository.find({
                where: { is_active: true }
            });
            console.log(`[LostPetsService] Se encontraron ${result.length} mascotas activas`);
            await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, result);
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createLostPet(lostPet: LostPetCDto): Promise<LostPet> {
        const newLostPet = this.lostPetRepository.create({
            name: lostPet.name,
            species: lostPet.species,
            breed: lostPet.breed,
            color: lostPet.color,
            size: lostPet.size,
            description: lostPet.description,
            photo_url: lostPet.photo_url,
            owner_name: lostPet.owner_name,
            owner_email: lostPet.owner_email,
            owner_phone: lostPet.owner_phone,
            location: {
                type: 'Point',
                coordinates: [lostPet.lon, lostPet.lat],
            },
            address: lostPet.address,
            lost_date: new Date(lostPet.lost_date),
            is_active: true,
        });

        const result = await this.lostPetRepository.save(newLostPet);
        await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);
        return result;
    }
}