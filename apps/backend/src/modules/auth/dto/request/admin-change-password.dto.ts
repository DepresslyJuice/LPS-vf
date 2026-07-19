import { IsInt, IsString, MinLength, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminChangePasswordDto {
  @ApiProperty({
    description: 'ID del usuario al que se le cambiará la contraseña',
    example: 42,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Nueva contraseña (mínimo 8 caracteres)',
    example: 'NuevaContraseña123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
