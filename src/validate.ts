import { keys, omitError } from './utils';
import type { FormErrors, FormRule, FormRules, FormStore } from './types';

function validateField<T extends {}, K extends keyof T>(
  values: T,
  value: T[K],
  rules: readonly FormRule<T, T[K]>[],
) {
  for (const rule of rules) {
    const result = rule(value, values);
    if (typeof result === 'string') return result;
  }

  return void 0;
}

export function revalidate<T extends {}, K extends keyof T>(
  field: K,
  value: T[K],
  store: FormStore<T>,
  rules: readonly FormRule<T, T[K]>[],
): FormErrors<T> {
  const result = validateField(store.values, value, rules);

  return result
    ? { ...store.errors, [field]: result }
    : omitError(store.errors, field);
}

export function validate<T extends {}>(values: T, rules: FormRules<T> = {}): FormErrors<T> {
  return keys(rules).reduce<FormErrors<T>>((obj, field) => {
    const result = validateField(values, values[field], rules[field]!);
    if (result) obj[field] = result;
    return obj;
  }, {});
}
