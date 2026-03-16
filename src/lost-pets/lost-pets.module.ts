import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { EmailModule } from 'src/email/email.module';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';

@Module({
    imports: [EmailModule, TypeOrmModule.forFeature([LostPet])],
    controllers: [LostPetsController],
    providers: [LostPetsService]
})
export class LostPetsModule {}
