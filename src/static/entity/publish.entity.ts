import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Publish {
    @PrimaryGeneratedColumn()
    jid: number;

    @Column('varchar', {
        length: 40,
    })
    publishName: string;

    @Column()
    publishStatus: Boolean;
}