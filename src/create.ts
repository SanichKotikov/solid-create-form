import { createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';

import { hasErrors, isEqual, keys } from './utils';
import { revalidate, validate } from './validate';
import type { Form, FormErrors, FormHandlers, FormOptions, FormStore } from './types';

function getInitState<T extends {}>(init: T): FormStore<T> {
  return { values: { ...init }, errors: {}, recheck: false };
}

export function createForm<T extends {}>(options: Readonly<FormOptions<T>>): Readonly<Form<T>> {
  let defaults: T = { ...options.defaultValues };

  const [store, setStore] = createStore<FormStore<T>>(getInitState(defaults));

  const handlers = keys(defaults).reduce((acc, field) => {
    acc[field] = <K extends keyof T>(value: T[K]) => {
      const rules = options.rules?.[field];

      setStore((prev) => ({
        ...prev,
        errors: prev.recheck && !!rules
          ? revalidate(field, value, prev, rules)
          : prev.errors,
        values: { ...prev.values, [field]: value },
      }));
    };

    return acc;
  }, {} as FormHandlers<T>);

  const setErrors = (value: FormErrors<T>) => {
    setStore('errors', (prev: FormErrors<T>) => ({ ...prev, ...value }));
  };

  const trigger = (): FormErrors<T> => {
    const errors = validate<T>(store.values, options.rules);
    setStore((prev) => ({ ...prev, errors, recheck: true }));

    return errors;
  };

  const wrapSubmit = (callback: (values: T) => void) => {
    return (event?: SubmitEvent) => {
      if (event instanceof Event) event.preventDefault();
      if (!hasErrors(trigger())) callback(store.values);
    };
  };

  const reset = (updates?: Partial<T>) => {
    defaults = { ...defaults, ...updates };
    setStore(getInitState(defaults));
  };

  return {
    values: createMemo(() => store.values),
    errors: createMemo(() => store.errors),
    isDirty: createMemo(() => !isEqual(defaults, store.values)),
    isValid: createMemo(() => !hasErrors(validate<T>(store.values, options.rules))),
    handlers,
    setErrors,
    wrapSubmit,
    trigger,
    reset,
  };
}
