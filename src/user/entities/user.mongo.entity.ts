import { Column, ObjectIdColumn } from 'typeorm';

export class User {
  @ObjectIdColumn()
  id?: number;

  @Column({ default: null })
  name?: string;
}
