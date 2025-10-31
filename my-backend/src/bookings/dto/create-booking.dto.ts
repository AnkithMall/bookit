
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBookingDto {
    @IsInt()
    @IsPositive()
    slot_id: number;

    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsEmail()
    user_email: string;
}
