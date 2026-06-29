import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ example: "NestJS Fundamentals", minLength: 3 })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({
    example: "Aprende a crear APIs robustas con NestJS y TypeScript.",
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: "tea_1" })
  @IsString()
  teacherId!: string;

  @ApiProperty({ example: 30, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
