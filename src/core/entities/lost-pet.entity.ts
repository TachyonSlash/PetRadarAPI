import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Point } from "typeorm";
import { PetSize } from "../enums/pet-size.enum";
import { PetSpecies } from "../enums/pet-species.enum";

@Entity("lost_pets")
export class LostPet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int" })
  species!: PetSpecies;

  @Column({ type: "varchar", nullable: true })
  breed!: string | null;

  @Column({ type: "varchar" })
  color!: string;

  @Column({ type: "int" })
  size!: PetSize;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", nullable: true })
  photo_url!: string | null;

  @Column({ type: "varchar" })
  owner_name!: string;

  @Column({ type: "varchar" })
  owner_email!: string;

  @Column({ type: "varchar" })
  owner_phone!: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  location!: Point;

  @Column({ type: "varchar" })
  address!: string;

  @Column({ type: "timestamp" })
  lost_date!: Date;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}