import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData } from './data/seed-data';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.reloadUsers();
    await this.reloadProducts(adminUser);
    return 'Seed Executed!';
  }

  private async reloadProducts(user: User) {
    const insertPromises = [];
    const products = initialData.products;

    await this.productsService.deleteAllProducts();
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });
    await Promise.all(insertPromises);

    return true;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async reloadUsers() {
    const seedUsers = initialData.users;
    const dbUsers = await this.userRepository.save(
      seedUsers.map((user) => this.userRepository.create(user)),
    );
    return dbUsers[0];
  }
}
