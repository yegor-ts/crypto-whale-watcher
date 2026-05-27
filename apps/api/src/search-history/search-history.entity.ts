import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('search_history')
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 42 })
  address!: string;

  @CreateDateColumn({ name: 'searched_at' })
  searchedAt!: Date;
}
