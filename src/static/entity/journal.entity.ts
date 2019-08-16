import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Journal {
    @PrimaryGeneratedColumn()
    jid: number;

    @Column()
    uid: number;

    @Column('varchar', {
        length: 20,
        unique: true,
    })
    path: string;

    @Column('varchar', {
        length: 20,
        unique: true,
    })
    name: string;
}