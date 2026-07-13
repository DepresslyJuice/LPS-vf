import { ApiProperty } from "@nestjs/swagger";

export class CourseSectionResponseDto {
  @ApiProperty({ example: "section_1" })
  id!: string;

  @ApiProperty({ example: "course_nestjs" })
  courseId!: string;

  @ApiProperty({ example: "Semana 1: Introduccion" })
  title!: string;

  @ApiProperty({ example: "Conceptos base y preparacion del entorno." })
  summary!: string;

  @ApiProperty({ example: 1 })
  order!: number;
}
