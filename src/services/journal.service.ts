import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journal } from '../static/entity/journal.entity';

interface IOption {
    jid?: string;
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

    async find(journal: Journal): Promise<Journal> {
        return this.journalRepository.findOne(journal);
    }

    async search(option: IOption): Promise<Journal> {
        let journal = new Journal();
        journal = { ...journal, ...option };
        return this.journalRepository.findOne(journal);
    }
}