import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() password: string;
  @ApiPropertyOptional({ type: [String] }) roles?: string[];
}
