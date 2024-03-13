import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 5,
    description: 'How many rows do you need to see',
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Es lo mísmo que: enableIm,ÊlicitConversions: true
  limit?: number;

  @ApiProperty({
    example: 2,
    description: 'How many items do you want to skip',
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number) // Es lo mísmo que: enableIm,ÊlicitConversions: true
  offset?: number;
}
