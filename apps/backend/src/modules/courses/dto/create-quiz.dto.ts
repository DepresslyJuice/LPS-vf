import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class QuizQuestionDto {
  @ApiProperty({ example: "¿Cuál es la capital de Francia?" })
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiProperty({
    example: ["París", "Londres", "Berlín", "Madrid"],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  options!: string[];

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  correctAnswer!: number;
}

export class CreateQuizDto {
  @ApiProperty({ example: "Cuestionario de Introducción" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: "Evaluación sobre los conceptos básicos del curso." })
  @IsString()
  description!: string;

  @ApiProperty({ type: QuizQuestionDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  questions!: QuizQuestionDto[];
}
