import { randomUUID } from 'crypto';
import { UuidIdGenerator } from './id-generator.service';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('UuidIdGenerator', () => {
  it('genera un UUID usando crypto.randomUUID', () => {
    (randomUUID as unknown as jest.Mock).mockReturnValue('test-uuid');

    const generator = new UuidIdGenerator();
    expect(generator.generate()).toBe('test-uuid');
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });
});
