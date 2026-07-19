// src/modules/usuarios/dto/assign-roles.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRolesDto {
  @ApiProperty({
    description: 'Array de IDs de roles a asignar',
    example: [1, 2],
    type: [Number],
  })
  @IsNotEmpty({ message: 'La lista de roles es requerida' })
  @IsArray({ message: 'Los roles deben ser un arreglo' })
  @IsNumber({}, { each: true, message: 'Cada ID de rol debe ser un número' })
  roleIds: number[];
}
