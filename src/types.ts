import type { Accessor } from 'solid-js';

export type FormErrors<T extends {}> = Partial<Record<keyof T, string>>;
export type FormHandlers<T extends {}> = { [K in keyof T]: (value: T[K]) => void };
export type FormRule<V = unknown> = (value: V) => boolean | string;
export type FormRules<T extends {}> = Partial<{ [K in keyof T]: readonly FormRule<T[K]>[] }>;
export type FormValidateResult = string | undefined;

export interface FormOptions<T extends {}> {
  defaultValues: T;
  rules?: FormRules<T>;
}

export interface Form<T extends {}> {
  values: Accessor<T>;
  errors: Accessor<FormErrors<T>>;
  isDirty: Accessor<boolean>;
  handlers: FormHandlers<T>;
  setErrors: (errors: FormErrors<T>) => void;
  wrapSubmit: (callback: (values: T) => void) => (event?: SubmitEvent) => void;
  reset: (updates?: Partial<T>) => void;
}
