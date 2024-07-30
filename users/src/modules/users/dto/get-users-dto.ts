import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsNumber({}, { each: true })
  id: number | number[] | undefined;

  @IsOptional()
  @IsString({ each: true })
  email: string | string[] | undefined;

  @IsOptional()
  @IsDate()
  created_from: Date | undefined;

  @IsOptional()
  @IsDate()
  created_to: Date | undefined;

  @IsOptional()
  @IsNumber()
  page: number | undefined;

  @IsOptional()
  @IsNumber()
  page_items: number | undefined;
}
