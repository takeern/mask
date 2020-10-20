import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Generated } from 'typeorm';


@Entity()
export class Journal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 30,
    comment: '期刊名称',
    default: null,
  })
  journalType: string;

  @Column('varchar', {
    length: 500,
    comment: '文章名字',
    default: null,
  })
  artTitle: string;

  @Column('varchar', {
    length: 200,
    comment: '作者名字',
    default: null,
  })
  userName: string;

  @Column('varchar', {
    length: 20,
    comment: 'ip',
    default: null,
  })
  ip: string;

  @Column('varchar', {
    length: 30,
    comment: '期刊时间',
    default: null,
  })
  journalTime: string;

  @Column('bool', {
    default: false,
  })
  isPublish: boolean;

  @Column('int')
  journalId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}