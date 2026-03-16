import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { LostPetCDto } from 'src/core/models/lostPet.model';

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
    ) {}

    async findAll(): Promise<LostPet[]> {
        try {
            const result = await this.lostPetRepository.find();
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
        return result;
    }
}