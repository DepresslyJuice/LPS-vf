import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: "Ana Torres", minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: "ana.torres@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;
}
