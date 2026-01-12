import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SaveProductUseCase } from '../../../application/use-cases/product/save-product.usecase';
import { ProductDto } from '../../../application/dto/product.dto';
import { GetProductByIdUseCase } from '../../../application/use-cases/product/get-product-by-id.usecase';
import { GetAllProductsUseCase } from 'src/application/use-cases/product/get-all-products.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly saveProduct: SaveProductUseCase,
    private readonly getProductById: GetProductByIdUseCase,
    private readonly getAllProducts: GetAllProductsUseCase,
    //private readonly getActiveProducts: GetActiveProductsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: ProductDto): Promise<void> {
    await this.saveProduct.execute(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ProductDto | null> {
    const product = await this.getProductById.execute(id);
    return product;
  }
  @Get()
  async getAll(): Promise<ProductDto[] | null> {
    const products = await this.getAllProducts.execute();
    return products;
  }
  /*
  @Get()
  async getActive(): Promise<ProductDto[]> {
    const products = await this.getActiveProducts.execute();
    return products.map((p) => this.mapProductToDto(p));
  }
  */
}
