import { ApiProperty } from "@nestjs/swagger";

export class CourseResponseDto {
  @ApiProperty({ example: "cou_1" })
  id!: string;

  @ApiProperty({ example: "NestJS Fundamentals" })
  title!: string;

  @ApiProperty({
    example: "Aprende a crear APIs robustas con NestJS y TypeScript.",
  })
  description!: string;

  @ApiProperty({ example: "tea_1" })
  teacherId!: string;

  @ApiProperty({ example: 30, minimum: 1 })
  capacity!: number;
}
