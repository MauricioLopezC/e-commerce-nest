export class ImageResponseDto {
  url: string;
}

export class DeleteImageResponseDto {
  ok: string;
}

//TODO:  Use this as image response dto and delete current ImageResponseDto
export class Image {
  id: number;
  imgSrc: string;
  productId: number;
  productSkuId: number;
}
