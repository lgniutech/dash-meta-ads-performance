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
  
  // Identify the first type in the priority list that actually exists in the data
  const bestType = typeList.find(type => actions.some((a: any) => a.action_type === type));
  
  if (!bestType) return 0;
  
  // Sum only the values for that specific best matching type to avoid double counting
  return actions
    .filter((a: any) => a.action_type === bestType)
    .reduce((sum, a) => sum + parseFloat(a.value || 0), 0);
}

export function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}
