import { batch, createMemo, createSignal } from 'solid-js';

import { hasErrors, isEqual, keys } from './utils';
import { revalidate, validate } from './validate';
import type { Form, FormErrors, FormHandlers, FormOptions } from './types';

// TODO: looks like setter of createSignal has wrong typings, try to fix

export function createForm<T>(options: Readonly<FormOptions<T>>): Readonly<Form<T>> {
  let defaults: T = { ...options.defaultValues };

  const [values, updValues] = createSignal<T>(defaults);
  const [errors, updErrors] = createSignal<FormErrors<T>>({});
  const [recheck, updRecheck] = createSignal(false);

  const isDirty = createMemo(() => !isEqual(defaults, values()));

  const handlers = keys(defaults).reduce((acc, field) => {
    acc[field] = <K extends keyof T>(value: T[K]) => {
      const formErrors: FormErrors<T> = recheck() ? revalidate(field, value, errors(), options.rules) : errors();

      batch(() => {
        // @ts-ignore
        updValues((prev: T) => ({ ...prev, [field]: value }));
        // @ts-ignore
        updErrors(formErrors);
      });
    };
    return acc;
  }, {} as FormHandlers<T>);

  const setErrors = (value: FormErrors<T>) => {
    // @ts-ignore
    updErrors((prev: FormErrors<T>) => ({ ...prev, ...value }));
  };

  const wrapSubmit = (callback: (values: T) => void) => {
    return (event?: SubmitEvent) => {
      if (event instanceof Event) event.preventDefault();
      const formErrors: FormErrors<T> = validate(values(), options.rules);

      batch(() => {
        // @ts-ignore
        updErrors(formErrors);
        updRecheck(true);
      });

      if (!hasErrors(formErrors)) callback(values());
    };
  };

  const reset = (updates?: Partial<T>) => {
    defaults = { ...defaults, ...updates };

    batch(() => {
      // @ts-ignore
      updValues(defaults);
      updErrors({});
      updRecheck(false);
    });
  };

  return { values, errors, isDirty, handlers, setErrors, wrapSubmit, reset };
}
