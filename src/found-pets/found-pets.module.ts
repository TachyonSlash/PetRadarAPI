import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { EmailModule } from 'src/email/email.module';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';
import { LostPet } from 'src/core/entities/lost-pet.entity';

@Module({
    imports: [EmailModule, TypeOrmModule.forFeature([FoundPet, LostPet])],
    controllers: [FoundPetsController],
    providers: [FoundPetsService]
})
export class FoundPetsModule {}
