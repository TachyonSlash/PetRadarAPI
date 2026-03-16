import { Body, Controller, Get, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { LostPetCDto } from 'src/core/models/lostPet.model';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  async getAllLostPets() {
    return this.lostPetsService.findAll();
  }

  @Post()
  async createLostPet(@Body() lostPet: LostPetCDto) {
    return this.lostPetsService.createLostPet(lostPet);
  }
}