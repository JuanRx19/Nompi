import { NotFoundException } from '@nestjs/common';
import { CustomersController } from './customer.controller';
import { PaymentsController } from './payments.controller';
import { ProductsController } from './product.controller';
import { TransactionsController } from './transactions.controller';

import { ProductDto } from '../../../application/dto/product.dto';

describe('REST Controllers (unit)', () => {
  it('ProductsController delega create y getAll/getById', async () => {
    const saveProduct = { execute: jest.fn().mockResolvedValue(undefined) };
    const getProductById = {
      execute: jest.fn().mockResolvedValue({ id: 'p1' }),
    };
    const getAllProducts = {
      execute: jest.fn().mockResolvedValue([{ id: 'p1' }]),
    };

    const controller = new ProductsController(
      saveProduct as any,
      getProductById as any,
      getAllProducts as any,
    );

    const dto = new ProductDto();
    dto.id = 'p1';
    dto.name = 'P';
    dto.price = 1;
    dto.stock = 1;

    await controller.create(dto);
    expect(saveProduct.execute).toHaveBeenCalledWith(dto);

    await expect(controller.getById('p1')).resolves.toEqual({ id: 'p1' });
    await expect(controller.getAll()).resolves.toEqual([{ id: 'p1' }]);
  });

  it('CustomersController delega create', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 'c1' }) };
    const controller = new CustomersController(useCase as any);

    await expect(controller.create({} as any)).resolves.toEqual({ id: 'c1' });
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('TransactionsController delega create', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 't1' }) };
    const controller = new TransactionsController(useCase as any);

    await expect(controller.create({} as any)).resolves.toEqual({ id: 't1' });
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('PaymentsController.simulatePayment retorna DECLINED si tarjeta no aprueba', async () => {
    const controller = new PaymentsController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { onApprovedNompiTransaction: jest.fn() } as any,
      { findById: jest.fn() } as any,
      { generate: jest.fn() } as any,
    );

    const result = await controller.simulatePayment({
      productSku: 'p1',
      cardNumber: '4111111111111111',
      customerName: 'N',
      customerEmail: 'n@test.com',
      customerDocument: '1',
      address: 'a',
      city: 'c',
      phone: 'p',
    } as any);

    expect(result).toEqual({ status: 'DECLINED' });
  });

  it('PaymentsController.simulatePayment lanza NotFound si no hay producto', async () => {
    const controller = new PaymentsController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { onApprovedNompiTransaction: jest.fn() } as any,
      { findById: jest.fn().mockResolvedValue(null) } as any,
      { generate: jest.fn().mockReturnValue('tx') } as any,
    );

    await expect(
      controller.simulatePayment({
        productSku: 'p1',
        cardNumber: '4242424242424242',
        customerName: 'N',
        customerEmail: 'n@test.com',
        customerDocument: '1',
        address: 'a',
        city: 'c',
        phone: 'p',
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('PaymentsController.simulatePayment APPROVED persiste transacción', async () => {
    const transactionService = {
      onApprovedNompiTransaction: jest.fn().mockResolvedValue(undefined),
    };

    const controller = new PaymentsController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      transactionService as any,
      { findById: jest.fn().mockResolvedValue({ id: 'p1', price: 10 }) } as any,
      { generate: jest.fn().mockReturnValue('tx') } as any,
    );

    const result = await controller.simulatePayment({
      productSku: 'p1',
      cardNumber: '4242 4242 4242 4242',
      customerName: 'N',
      customerEmail: 'n@test.com',
      customerDocument: '1',
      address: 'a',
      city: 'c',
      phone: 'p',
    } as any);

    expect(result.status).toBe('APPROVED');
    expect(transactionService.onApprovedNompiTransaction).toHaveBeenCalledTimes(
      1,
    );
  });
});
