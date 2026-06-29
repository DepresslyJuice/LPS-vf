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
}
