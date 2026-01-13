import { render } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';

jest.mock('./ui/ProductCard', () => ({
  ProductCard: ({ product }: any) => {
    return <div data-testid="product-card">{product.name}</div>;
  },
}));

describe('ProductGrid', () => {
  it('muestra skeletons cuando loading=true', () => {
    const { container } = render(
      <ProductGrid products={[]} loading emptyMessage="Nada" />,
    );

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(8);
  });

  it('muestra emptyMessage cuando no hay productos', () => {
    const { getByText } = render(
      <ProductGrid products={[]} loading={false} emptyMessage="Nada" />,
    );
    expect(getByText('Nada')).toBeTruthy();
  });

  it('filtra productos deleted', () => {
    const { getAllByTestId } = render(
      <ProductGrid
        products={[
          { id: '1', name: 'A', description: 'D', price: 1, stock: 1, deleted: false },
          { id: '2', name: 'B', description: 'D', price: 1, stock: 1, deleted: true },
        ]}
      />,
    );
    expect(getAllByTestId('product-card').length).toBe(1);
  });
});
