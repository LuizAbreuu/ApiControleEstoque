import { ProductForm } from '@/modules/products/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
        <p className="text-muted-foreground">
          Preencha os dados abaixo para cadastrar um novo produto.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
