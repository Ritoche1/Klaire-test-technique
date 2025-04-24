import { IsNotEmpty, IsString } from 'class-validator';

export class AddressSearchDto {
  @IsString({ message: "Le champ 'q' doit être une chaîne de caractères." })
  @IsNotEmpty({ message: "Le champ 'q' est requis et ne peut pas être vide." })
  q: string;
}