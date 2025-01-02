export function formatCurrency(value: number): string {
  if (value == null) {
    return "0";
  }

  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
  });
}