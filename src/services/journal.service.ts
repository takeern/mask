import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Journal } from '../static/entity/journal.entity';

interface IOption {
    journalType?: string;
    artTitle?: string;
    userName?: string;
    journalTime?: string;
    journalId?: number;
    ip?: string;
}

@Injectable()
export class JournalService {
    constructor(
        @InjectRepository(Journal)
        private readonly journalRepository: Repository<Journal>,
    ) { }

    async save(journal: Journal): Promise<Journal> {
        return this.journalRepository.save(journal);
    }

    async update(journal: Journal, option: IOption): Promise<UpdateResult> {
        return this.journalRepository.update(journal, option);
    }

    async find(journal: Journal): Promise<Journal> {
        return this.journalRepository.findOne(journal);
    }

    async search(option: IOption): Promise<Journal> {
        let journal = new Journal();
        journal = { ...journal, ...option };
        return this.journalRepository.findOne(journal);
    }

    async searchTime(journalType: string): Promise<Journal[]> {
        return this.journalRepository.createQueryBuilder('journal')
            .select('journalTime')
            .distinct(true)
            .orderBy('journalTime')
            .where("journal.journalType= :journalType", { journalType, })
            .getRawMany();
    }

    async getJournals(journalType: string, journalTime: string): Promise<[Journal[], number]> {
        return this.journalRepository.createQueryBuilder('journal')
            .where("journal.journalType= :journalType", { journalType, })
            .where("journal.journalTime= :journalTime", { journalTime, })
            .orderBy('journalId')
            .getManyAndCount();
    }

    async searchJournals(artTitle: string): Promise<[Journal[], number]> {
        return this.journalRepository.createQueryBuilder('journal')
            .orderBy('updateTime', 'DESC')
            .where("journal.artTitle like :artTitle", { artTitle: `%${artTitle}%` })
            .limit(100)
            .getManyAndCount();
    }
}

