import { ApiProperty } from "@nestjs/swagger";

export class StudentResponseDto {
  @ApiProperty({ example: "stu_1" })
  id!: string;

  @ApiProperty({ example: "Ana Torres" })
  name!: string;

  @ApiProperty({ example: "ana.torres@example.com" })
  email!: string;

  @ApiProperty({ example: ["cou_1"], type: [String] })
  enrolledCourseIds!: string[];
}
