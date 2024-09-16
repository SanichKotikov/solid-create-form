import type { FormErrors } from './types';

export function keys<T extends {}>(obj: T) {
  return Object.keys(obj) as unknown as ReadonlyArray<keyof T>;
}

export function omitError<T extends {}>(errors: FormErrors<T>, name: keyof T) {
  const { [name]: _, ...result } = errors;
  return result as FormErrors<T>;
}

// TODO: rewrite
export function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasErrors<T extends {}>(errors: FormErrors<T>): boolean {
  return keys(errors).some((prop) => Boolean(errors[prop]));
}
