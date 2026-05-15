import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function fmtNum(value: number) {
  return new Intl.NumberFormat("pt-BR").format(Math.round(value));
}

export function fmtPct(value: number, decimals = 2) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function safeDiv(a: number, b: number) {
  return b !== 0 ? a / b : 0;
}
