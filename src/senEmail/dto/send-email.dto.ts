import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendEmailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string
}