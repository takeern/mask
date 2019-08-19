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
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 30,
    })
    contactEmail: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    contactPhone: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 60,
    })
    keyword: string;

    @Column('varchar', {
        length: 500,
    })
    abstract: string;

    @Column({
        type: 'varchar',
        length: 40,
    })
    submitType: string;

    @Column({
        type: 'varchar',
        length: 500,
    })
    notes: string;
}