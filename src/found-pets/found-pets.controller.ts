import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { FoundPetCDto } from 'src/core/models/foundPet.model';
import { LostPetCDto } from 'src/core/models/lostPet.model';

@Controller('found-pets')
export class FoundPetsController {
    constructor(private readonly FoundPetService : FoundPetsService){}

    @Get()
    async getAllFoundPets(){
        const result = await this.FoundPetService.findAll();
        return result;
    }

    @Post()
    async createFoundPet(@Body() foundPet : FoundPetCDto){
        const result = this.FoundPetService.createFoundPet(foundPet);
        return result;
    }
}
