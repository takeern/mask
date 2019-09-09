import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journal } from '../static/entity/journal.entity';

interface IOption {
    uid?: number;
    jid?: number;
}

interface IRemoveOption {
    jid: number;
    uid: number;
}

interface ISaveOption {
    name: string;
    path: string;
    uid: number;
    submitType: string;
    abstract: string;
    contactEmail?: string;
    contactPhone?: number;
    title: string;
    keyword?: string;
    notes?: string;
}

@Injectable()
export class JournalService {
    public journalType = [
        'Journal of Research in Vocational Education (JRVE)',
        'Journal of Progress in Civil Engineering (JPCE)',
        'Journal of Petroleum and Mining Engineering (JPME)',
        'Journal of Contemporary Medical Practice (JCMP)',
        'Journal of Research in Science and Engineering (JRSE)',
        'Journal of Educational Research and Policies (JERP)',
        'Journal of Metallurgy and Materials Engineering (JMME)',
        'International Journal of Environment Research (IJER)',
        'Journal of Global Economy, Business and Finance (JGEBF)',
        'Journal of Energy Science (JES)',
        'Journal of Social Science and Humanities (JSSH)',
        'Journal of Agriculture and Horticulture (JAH)',
    ];
    constructor(
        @InjectRepository(Journal)
        private readonly journalRepository: Repository<Journal>
    ) { }

    async save(journal: Journal): Promise<Journal> {
        return this.journalRepository.save(journal);
    }

    async saveByOption(option: ISaveOption): Promise<Journal> {
        const journal = new Journal();
        journal.name = option.name;
        journal.submitType = option.submitType;
        journal.path = option.path;
        journal.uid = option.uid;
        journal.title = option.title;
        journal.abstract = option.abstract;
        if (option.contactEmail) {
            journal.contactEmail = option.contactEmail;
        }
        if (option.contactPhone) {
            journal.contactPhone = option.contactPhone;
        }
        if (option.keyword) {
            journal.keyword = option.keyword;
        }
        if (option.notes) {
            journal.notes = option.notes;
        }
        return await this.save(journal);
    }

    async find(journal: Journal): Promise<Journal> {
        return this.journalRepository.findOne(journal);
    }

    async search(option: IOption): Promise<Journal> {
        let journal = new Journal();
        journal = { ...journal, ...option };
        return await this.journalRepository.findOne(journal);
    }

    async searchAll(option: IOption): Promise<Journal[]> {
        let journal = new Journal();
        journal = { ...journal, ...option };
        return await this.journalRepository.find(journal);
    }

    async delete(option: IRemoveOption) {
        const journal = new Journal();
        journal.jid = option.jid;
        journal.uid = option.uid;
        return await this.journalRepository.remove(journal);
    }
}