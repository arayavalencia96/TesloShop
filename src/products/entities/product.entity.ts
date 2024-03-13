import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductImage } from './';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '061d7841-af7a-45af-ac00-1bbd79561b1f',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: `River's T-shirt`,
    description: 'Product Description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt',
    description: 'Product slug - for SEO routes',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['XL', 'M'],
    description: 'Product sizes',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['t-shirt', 'shirt'],
    description: 'Product tag',
  })
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    example: '061d7841-af7a-45af-ac00-1bbd79561b1f',
    description: 'Product ID',
    uniqueItems: true,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title
        .toLowerCase()
        .trim()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
