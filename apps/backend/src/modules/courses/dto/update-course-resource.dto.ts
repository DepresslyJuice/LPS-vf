import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class UpdateCourseResourceDto {
  @ApiPropertyOptional({ example: "Guia de instalacion", minLength: 3 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: "text", enum: ["link", "text"] })
  @IsOptional()
  @IsIn(["link", "text"])
  type?: "link" | "text";

  @ApiPropertyOptional({ example: "https://example.com/guia" })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: "Lee esta nota antes de iniciar." })
  @IsOptional()
  @IsString()
  content?: string;
}
