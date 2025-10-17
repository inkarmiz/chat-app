import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "../assets/lottie-json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#4a2c7173] text-[#7b2ff7] border-[1px] border-[#7b2ff7aa]",
  "bg-[#2c3d71b8] text-[#006eff] border-[1px] border-[#006effaa]",
  "bg-[#2c71734d] text-[#00ffe0] border-[1px] border-[#00ffe0aa]",
]

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};