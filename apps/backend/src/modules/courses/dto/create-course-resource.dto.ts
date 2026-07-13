import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateCourseResourceDto {
  @ApiProperty({ example: "Guia de instalacion", minLength: 3 })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: "link", enum: ["link", "text"] })
  @IsIn(["link", "text"])
  type!: "link" | "text";

  @ApiPropertyOptional({ example: "https://example.com/guia" })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: "Lee esta nota antes de iniciar." })
  @IsOptional()
  @IsString()
  content?: string;
}
