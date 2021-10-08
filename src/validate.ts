import { isString, keys, omit } from './utils';
import type { FormErrors, FormRule, FormRules, FormValidateResult } from './types';

function validateField<T extends {}, K extends keyof T>(
  values: T,
  value: T[K],
  rules: readonly FormRule<T, T[K]>[],
): FormValidateResult {
  return rules.reduce<FormValidateResult>((acc, validator) => {
    if (acc) return acc;
    const result = validator(value, values);
    return isString(result) ? result : undefined;
  }, undefined);
}

export function revalidate<T extends {}, K extends keyof T>(
  field: K,
  value: T[K],
  values: T,
  errors: FormErrors<T>,
  rules: FormRules<T> | undefined,
): FormErrors<T> {
  const fieldRules: readonly FormRule<T, T[K]>[] | undefined = rules?.[field];
  if (!fieldRules) return errors;
  const result = validateField(values, value, fieldRules);
  return result ? { ...errors, [field]: result } : (omit(errors, field) as FormErrors<T>);
}

export function validate<T extends {}>(values: T, rules: FormRules<T> = {}): FormErrors<T> {
  return keys(rules).reduce<FormErrors<T>>((obj, field) => {
    const result = validateField(values, values[field], rules[field]!);
    if (result) obj[field] = result;
    return obj;
  }, {});
}
