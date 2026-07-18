import { ApiProperty } from "@nestjs/swagger";
import { QuizQuestionDto } from "./create-quiz.dto";

export class QuizResponseDto {
  @ApiProperty({ example: "quiz_1" })
  id!: string;

  @ApiProperty({ example: "section_1" })
  sectionId!: string;

  @ApiProperty({ example: "Cuestionario de Introducción" })
  title!: string;

  @ApiProperty({ example: "Evaluación sobre los conceptos básicos del curso." })
  description!: string;

  @ApiProperty({ type: QuizQuestionDto, isArray: true })
  questions!: QuizQuestionDto[];
}
