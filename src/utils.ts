import type { FormErrors } from './types';

export function keys<T extends {}>(obj: T) {
  return Object.keys(obj) as unknown as ReadonlyArray<keyof T>;
}

export function omit<T extends {}, K extends keyof T>(object: T, ...props: K[]): Omit<T, K> {
  return keys(object).reduce((acc, prop) => {
    if (!props.includes(prop as K)) (acc as any)[prop] = object[prop];
    return acc;
  }, {} as Omit<T, K>);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// TODO: rewrite
export function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasErrors<T extends {}>(errors: FormErrors<T>): boolean {
  return keys(errors).some((prop) => Boolean(errors[prop]));
}
