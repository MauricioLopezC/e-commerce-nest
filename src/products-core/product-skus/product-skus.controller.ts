import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import {
  CreateBatchProductSkusDto,
  CreateProductSkusDto,
} from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ProductSkuResponseDto,
  ProductSkuBatchUpdateResponse,
} from './dto/product-skus-response.dto';
import { mapToProductSkuResponseDto } from './mapper';

@Controller('products/:productId/product-skus')
export class ProductSkusController {
  constructor(private readonly productSkusService: ProductSkusService) {}

  @ApiCreatedResponse({ type: ProductSkuResponseDto })
  @Roles(Role.Admin)
  @Post()
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createProductSkusDto: CreateProductSkusDto,
  ) {
    return mapToProductSkuResponseDto(
      await this.productSkusService.create(productId, createProductSkusDto),
    );
  }

  @ApiOkResponse({ type: [ProductSkuResponseDto] })
  @PublicRoute()
  @Get()
  async findAll(@Param('productId', ParseIntPipe) productId: number) {
    const skus = await this.productSkusService.findAll(productId);
    return skus.map((sku) => mapToProductSkuResponseDto(sku));
  }

  @ApiOkResponse({ type: ProductSkuResponseDto })
  @PublicRoute()
  @Get(':id')
  async findOne(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return mapToProductSkuResponseDto(
      await this.productSkusService.findOne(productId, id),
    );
  }

  @ApiOkResponse({ type: ProductSkuResponseDto })
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductSkusDto: UpdateProductSkusDto,
  ) {
    return mapToProductSkuResponseDto(
      await this.productSkusService.update(productId, id, updateProductSkusDto),
    );
  }

  @ApiOkResponse({ type: ProductSkuResponseDto })
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return mapToProductSkuResponseDto(
      await this.productSkusService.remove(productId, id),
    );
  }

  @ApiOkResponse({ type: ProductSkuBatchUpdateResponse })
  @Roles(Role.Admin)
  @Post('batch')
  async batchCreate(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createbatchdto: CreateBatchProductSkusDto,
  ) {
    return await this.productSkusService.batchCreate(productId, createbatchdto);
  }
}
