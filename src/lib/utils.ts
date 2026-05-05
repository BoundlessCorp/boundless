import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { baseUrl } from './base-url'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName: string) {
  return baseUrl + '/' + pageName.replace(/ /g, '-');
}

export const isIframe = typeof window !== 'undefined' && window.self !== window.top;



