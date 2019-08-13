import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        length: 20,
        unique: true,
    })
    account: string;

    @Column('varchar', {
        length: 20
    })
    password: string;

    @Column('varchar', {
        length: 50
    })
    email: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}