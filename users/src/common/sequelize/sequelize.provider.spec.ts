import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from './sequelize.provider';

describe('Sequelize', () => {
  let provider: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Sequelize],
    }).compile();

    provider = module.get<Sequelize>(Sequelize);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
