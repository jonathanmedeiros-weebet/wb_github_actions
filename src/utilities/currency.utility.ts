export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { currency: 'BRL' });
}