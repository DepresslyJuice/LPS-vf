import { ApiProperty } from "@nestjs/swagger";

export class TeacherResponseDto {
  @ApiProperty({ example: "tea_1" })
  id!: string;

  @ApiProperty({ example: "Carlos Mendoza" })
  name!: string;

  @ApiProperty({ example: "carlos.mendoza@example.com" })
  email!: string;

  @ApiProperty({ example: "Backend development" })
  specialty!: string;
}
