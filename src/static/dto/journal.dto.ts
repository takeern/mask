import { IsEmail, IsNotEmpty, IsInt, Max } from 'class-validator';

class JournalSubmit {
    @IsEmail()
    contactEmail: string;
  
    @IsNotEmpty()
    @Max(20)
    name: string;

    @IsNotEmpty()
    @Max(20)
    contactPhone: string;

    @IsNotEmpty()
    @Max(50)
    title: string;

    @IsNotEmpty()
    @Max(60)
    keyword: string;

    @IsNotEmpty()
    @Max(200)
    abstract: string;

    @IsInt()
    @Max(20)
    submitType: number;

    @Max(500)
    notes: string;
}

export {
    JournalSubmit,
}