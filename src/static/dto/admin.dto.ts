import { IsEmail, IsNotEmpty, IsInt, MaxLength } from 'class-validator';

class searchJournal {

    account: string;

    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    updateTime: string;
}

class publishJournal {
    @IsNotEmpty()
    jid: number;
}

class addPublishDto {
    @IsNotEmpty()
    jid: number;

    @IsNotEmpty()
    publishName: string;
}

export {
    searchJournal,
    publishJournal,
    addPublishDto,
}