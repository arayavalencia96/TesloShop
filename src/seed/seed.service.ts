import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.reloadProducts();
    return `Seed Executed!`;
  }

  private async reloadProducts() {
    const insertPromises = [];
    const products = initialData.products;

    await this.productsService.deleteAllProducts();
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });
    await Promise.all(insertPromises);

    return true;
  }
}
