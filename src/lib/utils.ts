import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtBRL(value: any) {
  const n = parseFloat(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

export function fmtNum(value: any) {
  const n = Math.round(parseFloat(value) || 0);
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function fmtPct(value: any, decimals = 2) {
  const n = parseFloat(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n / 100);
}

export function getActionValue(actions: any[], type: string) {
  if (!actions) return 0;
  const action = actions.find(a => a.action_type === type);
  return action ? parseFloat(action.value) : 0;
}

export function safeDiv(a: number, b: number) {
  return b !== 0 ? a / b : 0;
}
