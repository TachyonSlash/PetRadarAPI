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

@Injectable()
export class FoundPetsService {
    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService,
    ) {}

    async findAll() : Promise<FoundPet[]> {
        try {
            const result = await this.foundPetRepository.find();
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createFoundPet(foundPet: FoundPetCDto): Promise<Boolean> {
        const relatedLostPet = await this.lostPetRepository.findOneBy({
            id: foundPet.lost_pet_id,
        });

        if (!relatedLostPet) {
            throw new NotFoundException(
                `No se encontro la mascota perdida con id ${foundPet.lost_pet_id}`,
            );
        }

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

        const lostLocation = relatedLostPet.location as unknown as {
            coordinates: [number, number];
        };

        const lostPetDto: LostPetCDto = {
            name: relatedLostPet.name,
            species: relatedLostPet.species,
            breed: relatedLostPet.breed ?? '',
            color: relatedLostPet.color,
            size: relatedLostPet.size,
            description: relatedLostPet.description,
            photo_url: relatedLostPet.photo_url ?? '',
            owner_name: relatedLostPet.owner_name,
            owner_email: relatedLostPet.owner_email,
            owner_phone: relatedLostPet.owner_phone,
            lat: lostLocation.coordinates[1],
            lon: lostLocation.coordinates[0],
            address: relatedLostPet.address,
            lost_date: relatedLostPet.lost_date,
        };

        const template = generateFoundPetEmailTemplate(foundPet, lostPetDto);

        const options: EmailOptions = {
            to: 'hectorjaz2004@gmail.com',
            subject: 'Mascota encontrada - posible coincidencia',
            htmlBody: template,
        };

        const result = await this.emailService.sendEmail(options);
        return result;
    }
}
