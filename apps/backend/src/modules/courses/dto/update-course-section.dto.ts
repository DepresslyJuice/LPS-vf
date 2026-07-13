import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateCourseSectionDto {
  @ApiPropertyOptional({ example: "Semana 1: Introduccion", minLength: 3 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: "Conceptos base y preparacion del entorno." })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
