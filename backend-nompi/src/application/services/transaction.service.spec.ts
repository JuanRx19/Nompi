import { TransactionService } from './transaction.service';
import { TransactionStatus } from '../../domain/enums/transactionStatusEnum';
import { DeliveryStatus } from '../../domain/enums/deliveryStatusEnum';
import { Customer } from '../../domain/models/customer';
import { Delivery } from '../../domain/models/delivery';
import { Transaction } from '../../domain/models/transaction';
import type { CustomerRepository } from '../../domain/ports/repositories/customer.repository';
import type { DeliveryRepository } from '../../domain/ports/repositories/delivery.repository';
import type { IProductRepository } from '../../domain/ports/repositories/product.repository';
import type { TransactionRepository } from '../../domain/ports/repositories/transaction.repository';
import type { IIdGenerator } from './id-generator.service';

type ServiceDeps = {
  customerRepository: jest.Mocked<CustomerRepository>;
  transactionRepository: jest.Mocked<TransactionRepository>;
  deliveryRepository: jest.Mocked<DeliveryRepository>;
  productRepository: jest.Mocked<IProductRepository>;
  idGenerator: jest.Mocked<IIdGenerator>;
};

const makeService = (overrides: Partial<ServiceDeps> = {}) => {
  const customerRepository: jest.Mocked<CustomerRepository> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
    ...overrides.customerRepository,
  };

  const transactionRepository: jest.Mocked<TransactionRepository> = {
    findById: jest.fn(),
    findByCustomerId: jest.fn(),
    save: jest.fn(),
    ...overrides.transactionRepository,
  };

  const deliveryRepository: jest.Mocked<DeliveryRepository> = {
    findById: jest.fn(),
    findByTransactionId: jest.fn(),
    save: jest.fn(),
    ...overrides.deliveryRepository,
  };

  const productRepository: jest.Mocked<IProductRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    save: jest.fn(),
    decrementStock: jest.fn(),
    ...overrides.productRepository,
  };

  const idGenerator: jest.Mocked<IIdGenerator> = {
    generate: jest.fn().mockReturnValue('gen-id'),
    ...overrides.idGenerator,
  };

  // Nota: aquí instanciamos directo la clase para unit testing.
  // No necesitamos el módulo de Nest para probar la lógica.
  const service = new TransactionService(
    customerRepository,
    transactionRepository,
    deliveryRepository,
    productRepository,
    idGenerator,
  );

  return {
    service,
    customerRepository,
    transactionRepository,
    deliveryRepository,
    productRepository,
    idGenerator,
  };
};

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea transaction y delivery cuando no existen', async () => {
    const {
      service,
      customerRepository,
      transactionRepository,
      deliveryRepository,
      productRepository,
    } = makeService();

    transactionRepository.findById.mockResolvedValue(null);
    productRepository.decrementStock.mockResolvedValue(true);
    customerRepository.findByEmail.mockResolvedValue(null);
    deliveryRepository.findByTransactionId.mockResolvedValue(null);

    await service.onApprovedNompiTransaction({
      externalTransactionId: 'tx-1',
      amountInCents: 5000,
      productSku: 'sku-1',
      merchant: {
        name: 'Juan',
        email: 'juan@test.com',
        legal_id: '123',
      },
      idTransaction: 'nompi-123',
      baseFee: 100,
      deliveryFee: 200,
      delivery: { address: 'Calle 1', city: 'Bogotá', phone: '3000000000' },
    });

    expect(productRepository.decrementStock).toHaveBeenCalledWith('sku-1', 1);
    expect(customerRepository.save).toHaveBeenCalledTimes(1);
    expect(transactionRepository.save).toHaveBeenCalledTimes(1);

    const savedTransaction = transactionRepository.save.mock.calls[0][0];
    expect(savedTransaction.status).toBe(TransactionStatus.PAID);
    expect(savedTransaction.totalAmount).toBe(50 + 100 + 200);

    expect(deliveryRepository.save).toHaveBeenCalledTimes(1);
    const savedDelivery: Delivery = deliveryRepository.save.mock.calls[0][0];
    expect(savedDelivery.status).toBe(DeliveryStatus.PENDING);
    expect(savedDelivery.idTransaction).toBe('tx-1');
  });

  it('no persiste nada si no puede decrementar stock', async () => {
    const {
      service,
      transactionRepository,
      deliveryRepository,
      productRepository,
      customerRepository,
    } = makeService();

    transactionRepository.findById.mockResolvedValue(null);
    productRepository.decrementStock.mockResolvedValue(false);

    await service.onApprovedNompiTransaction({
      externalTransactionId: 'tx-2',
      amountInCents: 5000,
      productSku: 'sku-2',
      merchant: {
        name: 'Ana',
        email: 'ana@test.com',
        legal_id: '456',
      },
      idTransaction: 'nompi-456',
    });

    expect(customerRepository.save).not.toHaveBeenCalled();
    expect(transactionRepository.save).not.toHaveBeenCalled();
    expect(deliveryRepository.save).not.toHaveBeenCalled();
  });

  it('si transaction ya existe, no la recrea pero sí crea delivery si falta', async () => {
    const {
      service,
      transactionRepository,
      deliveryRepository,
      productRepository,
    } = makeService();

    transactionRepository.findById.mockResolvedValue(
      new Transaction(
        'tx-3',
        'sku-3',
        'cust-1',
        50,
        0,
        0,
        50,
        TransactionStatus.PAID,
        'nompi-999',
      ),
    );
    deliveryRepository.findByTransactionId.mockResolvedValue(null);

    await service.onApprovedNompiTransaction({
      externalTransactionId: 'tx-3',
      amountInCents: 5000,
      productSku: 'sku-3',
      merchant: {
        name: 'X',
        email: 'x@test.com',
        legal_id: '999',
      },
      idTransaction: 'nompi-999',
    });

    expect(productRepository.decrementStock).not.toHaveBeenCalled();
    expect(transactionRepository.save).not.toHaveBeenCalled();
    expect(deliveryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('no crea delivery si ya existe', async () => {
    const existingCustomer = new Customer('c1', 'N', 'n@test.com', '1');
    const existingDelivery = new Delivery(
      'd1',
      'tx-4',
      'a',
      'c',
      'p',
      DeliveryStatus.SHIPPED,
    );

    const {
      service,
      transactionRepository,
      deliveryRepository,
      productRepository,
      customerRepository,
    } = makeService();

    transactionRepository.findById.mockResolvedValue(null);
    productRepository.decrementStock.mockResolvedValue(true);
    customerRepository.findByEmail.mockResolvedValue(existingCustomer);
    deliveryRepository.findByTransactionId.mockResolvedValue(existingDelivery);

    await service.onApprovedNompiTransaction({
      externalTransactionId: 'tx-4',
      amountInCents: 1000,
      productSku: 'sku-4',
      merchant: {
        name: 'N',
        email: 'n@test.com',
        legal_id: '1',
      },
      idTransaction: 'nompi-1',
    });

    expect(transactionRepository.save).toHaveBeenCalledTimes(1);
    expect(deliveryRepository.save).not.toHaveBeenCalled();
  });
});
