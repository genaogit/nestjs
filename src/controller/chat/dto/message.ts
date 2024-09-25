
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBase64, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MessageDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    idUser: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    typeMessage: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string | { size: number, type: string };


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    room: string;
}


export class RatingDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    idUsuario: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    idAdmin: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    calificacion: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    mensaje: string;
}

