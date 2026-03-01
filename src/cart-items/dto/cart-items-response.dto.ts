import { ProductSkuResponseDto } from 'src/products-core/product-skus/dto/product-skus-response.dto';
import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';

export class CartItemResponseDto {
  id: number;
  cartId: number;
  productId: number;
  productSkuId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductResponseDto;
  productSku: ProductSkuResponseDto;
}
