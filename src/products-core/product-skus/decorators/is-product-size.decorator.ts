import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isProductSize', async: false })
export class IsProductSizeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== 'string') return false;

    const upperValue = value.toUpperCase();

    // 1. Tallas de ropa (Letras)
    const validLetterSizes = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    if (validLetterSizes.includes(upperValue)) return true;

    // 2. Tallas numéricas (Zapatos, Niños, etc.)
    // Acepta: "1", "35", "42" (Solo enteros)
    const isNumericFormat = /^\d+$/.test(value);
    if (isNumericFormat) {
      const num = parseInt(value, 10);
      // Rango actualizado: 1 al 70
      return num >= 1 && num <= 70;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid size (e.g., S, M, L or an integer between 1-70)`;
  }
}

// Esta función es el decorador que usaremos en el DTO
export function IsProductSize(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductSizeConstraint,
    });
  };
}
