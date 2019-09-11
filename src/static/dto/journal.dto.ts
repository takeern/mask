import { IsEmail, IsNotEmpty, IsInt, MaxLength } from 'class-validator';

class JournalSubmit {
    @IsEmail()
    contactEmail: string;
  
    @IsNotEmpty()
    @MaxLength(20)
    name: string;

    @MaxLength(20)
    contactPhone: number;

    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @MaxLength(100)
    keyword: string;

    @IsNotEmpty()
    @MaxLength(2000)
    abstract: string;

    @MaxLength(20)
    submitType: string;

    @MaxLength(500)
    notes: string;

    path: string;

    @IsNotEmpty()
    uid: number;
}

class JournalGetInfo {
    @IsNotEmpty()
    uid: number;
}

class JournalDelete {
    @IsNotEmpty()
    jid: number;

    @IsNotEmpty()
    uid: number;
}

class JournalUpdate {
    @IsNotEmpty()
    jid: number;

    @IsNotEmpty()
    uid: number;
}

export {
    JournalSubmit,
    JournalGetInfo,
    JournalDelete,
    JournalUpdate,
}