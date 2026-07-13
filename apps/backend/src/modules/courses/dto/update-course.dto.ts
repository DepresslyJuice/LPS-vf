import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: "NestJS Advanced", minLength: 3 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({
    example: "Profundiza en APIs robustas con NestJS y TypeScript.",
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional({ example: "teacher_luis" })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ example: 40, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    example: "published",
    enum: ["draft", "published", "archived"],
  })
  @IsOptional()
  @IsIn(["draft", "published", "archived"])
  status?: "draft" | "published" | "archived";
}
