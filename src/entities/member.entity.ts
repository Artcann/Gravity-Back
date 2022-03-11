import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    
}