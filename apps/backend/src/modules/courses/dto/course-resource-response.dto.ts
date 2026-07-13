import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CourseResourceResponseDto {
  @ApiProperty({ example: "resource_1" })
  id!: string;

  @ApiProperty({ example: "section_1" })
  sectionId!: string;

  @ApiProperty({ example: "Guia de instalacion" })
  title!: string;

  @ApiProperty({ example: "link", enum: ["link", "text"] })
  type!: "link" | "text";

  @ApiPropertyOptional({ example: "https://example.com/guia" })
  url?: string;

  @ApiPropertyOptional({ example: "Lee esta nota antes de iniciar." })
  content?: string;
}
