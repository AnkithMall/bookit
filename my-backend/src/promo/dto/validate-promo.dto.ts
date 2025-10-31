
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePromoDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}
