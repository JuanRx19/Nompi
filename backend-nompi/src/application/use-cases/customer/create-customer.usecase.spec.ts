import { ConflictException } from '@nestjs/common';
import { CreateCustomerUseCase } from './create-customer.usecase';
import type { CustomerRepository } from '../../../domain/ports/repositories/customer.repository';
import type { IIdGenerator } from '../../services/id-generator.service';
import { CreateCustomerDto } from '../../dto/customer.dto';

describe('CreateCustomerUseCase', () => {
  it('lanza ConflictException si ya existe email', async () => {
    const repository: jest.Mocked<CustomerRepository> = {
      findById: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue({
        id: 'c1',
        name: 'N',
        email: 'a@test.com',
        document: '1',
      } as any),
    };

    const idGenerator: jest.Mocked<IIdGenerator> = {
      generate: jest.fn().mockReturnValue('gen-id'),
    };

    const useCase = new CreateCustomerUseCase(repository, idGenerator);

    const dto = new CreateCustomerDto();
    dto.name = 'N';
    dto.email = 'a@test.com';
    dto.document = '1';

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('crea customer y retorna dto', async () => {
    const repository: jest.Mocked<CustomerRepository> = {
      findById: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    const idGenerator: jest.Mocked<IIdGenerator> = {
      generate: jest.fn().mockReturnValue('gen-id'),
    };

    const useCase = new CreateCustomerUseCase(repository, idGenerator);

    const dto = new CreateCustomerDto();
    dto.name = 'N';
    dto.email = 'n@test.com';
    dto.document = '1';

    const result = await useCase.execute(dto);

    expect(idGenerator.generate).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('gen-id');
  });
});
