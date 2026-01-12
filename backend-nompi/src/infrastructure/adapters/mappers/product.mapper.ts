import { Product } from '../../../domain/models/product';
import { ProductDto } from '../../../application/dto/product.dto';

export class ProductMapper {
  static toDomain(dto: ProductDto): Product {
    return new Product(
      dto.id,
      dto.name,
      dto.description ?? '',
      dto.price,
      dto.stock,
      dto.imageUrl ?? '',
      dto.deleted ?? false,
    );
  }

  static toDto(product: Product): ProductDto {
    const dto = new ProductDto();
    dto.id = product.id;
    dto.name = product.name;
    dto.description = product.description;
    dto.price = product.price;
    dto.stock = product.stock;
    dto.imageUrl = product.imageUrl;
    dto.deleted = product.deleted;
    return dto;
  }

  static toDtoList(products: Product[]): ProductDto[] {
    return products.map((product) => this.toDto(product));
  }
}
