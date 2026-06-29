import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty({ example: "Carlos Mendoza", minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "carlos.mendoza@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Backend development", minLength: 2 })
  @IsString()
  @MinLength(2)
  specialty!: string;
}
