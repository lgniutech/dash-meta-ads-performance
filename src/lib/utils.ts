export function fmtBRL(val: any) {
  const n = parseFloat(val || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

export function fmtNum(val: any) {
  const n = parseFloat(val || 0);
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function getActionValue(actions: any[], types: string | string[]): number {
  if (!actions || !Array.isArray(actions)) return 0;
  
  const typeList = Array.isArray(types) ? types : [types];
  
  // Sum values for all requested types
  return actions
    .filter((a: any) => typeList.includes(a.action_type))
    .reduce((sum, a) => sum + parseInt(a.value || 0), 0);
}

export function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}
