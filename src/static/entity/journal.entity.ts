import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Journal {
    @PrimaryGeneratedColumn()
    jid: number;

    @Column()
    uid: number;

    @Column('varchar', {
        length: 40,
        unique: true,
    })
    path: string;

    @Column('varchar', {
        length: 30,
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
        default: 'nothing',
    })
    contactPhone: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 100,
        default: 'nothing',
    })
    keyword: string;

    @Column('varchar', {
        length: 2000,
    })
    abstract: string;

    @Column({
        type: 'varchar',
        length: 40,
    })
    submitType: string;

    @Column({
        type: 'varchar',
        length: 600,
        default: 'nothing',
    })
    notes: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}