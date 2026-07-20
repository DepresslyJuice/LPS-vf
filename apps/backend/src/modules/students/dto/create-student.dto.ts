import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateStudentDto {
  @ApiProperty({ example: "Ana Torres", minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "ana.torres@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "contraseña123", minLength: 6, description: "Contraseña para el acceso del estudiante al sistema" })
  @IsString()
  @MinLength(6)
  password!: string;
}
