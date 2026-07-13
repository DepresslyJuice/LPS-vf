import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateCourseSectionDto {
  @ApiProperty({ example: "Semana 1: Introduccion", minLength: 3 })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: "Conceptos base y preparacion del entorno." })
  @IsString()
  summary!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order!: number;
}
