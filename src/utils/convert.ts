import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function convertLamportsToSol(lamports: any) {
  return (lamports / LAMPORTS_PER_SOL).toFixed(3);
}
export function convertTokenDecimals(amount: string, decimals: number) {
  return (+amount / 10 ** decimals).toFixed(3);
}
export const balanceDisplayer = (val: string | number, fixed?: number) => {
  if (!val) return "0";
  const strValue = val.toString().split(".");
  const valNumber = Number(strValue[0]);
  if (!strValue[1] && strValue[0])
    return strValue[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (Number.isNaN(valNumber)) return "0";
  const decimal = (function getDecimal() {
    if (valNumber < 1 && valNumber >= 0) return 6;
    if (valNumber >= 1 && valNumber < 10) return 4;
    if (valNumber >= 10 && valNumber < 100) return 3;
    return 2;
  })();
  if (strValue[1]) {
    const afterPoint = strValue[1].slice(
      0,
      fixed !== undefined ? fixed : decimal
    );
    if (valNumber === 0 && afterPoint === "000000") return "< 0.000001";
    return `${valNumber
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${afterPoint}`;
  }
  return "";
};

const SUFFIX_SYMBOL = ["", "K", "M", "B", "T", "Z"];
// Return value: [shortenedNumber, suffixSymbol]
export function shortenNumber(number: number, maxLength = 8): [number, string] {
  if (number > 1e18) {
    const split = number.toString().split("e");
    return [Number(Number(split[0]).toFixed(2)), `e${split[1]}`];
  }

  if (Math.ceil(number).toString().length < maxLength) return [number, ""];

  const symIdx = Math.floor(Math.log10(Math.abs(number)) / 3);
  const suffix = SUFFIX_SYMBOL[symIdx] || "";
  if (symIdx === 0) return [number, suffix];

  const scale = 10 ** (symIdx * 3);
  const scaled = number / scale;

  return [scaled, suffix];
}
