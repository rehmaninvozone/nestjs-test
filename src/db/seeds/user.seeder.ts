import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "users" RESTART IDENTITY;');
    const password = await bcrypt.hash('12345678', 10);
    const repository = dataSource.getRepository(UserEntity);
    await repository.insert([
      {
        name: 'Admin',
        email: 'admin@app.com',
        password,
        isAdmin: true,
      },
    ]);
  }
}
