import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LostPetsService } from './lost-pets/lost-pets.service';
import { LostPetsController } from './lost-pets/lost-pets.controller';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsService } from './found-pets/found-pets.service';
import { FoundPetsController } from './found-pets/found-pets.controller';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [LostPetsModule, FoundPetsModule, EmailModule],
  controllers: [AppController, LostPetsController, FoundPetsController],
  providers: [AppService, LostPetsService, FoundPetsService],
})
export class AppModule {}
