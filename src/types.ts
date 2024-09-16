import type { Accessor } from 'solid-js';

export type FormErrors<T extends {}> = Partial<Record<keyof T, string>>;
export type FormHandlers<T extends {}> = { [K in keyof T]: (value: T[K]) => void };
export type FormRuleReturn = boolean | string;
export type FormRule<T extends {}, V extends unknown> = (value: V, values: T) => FormRuleReturn;
export type FormRules<T extends {}> = Partial<{ [K in keyof T]: readonly FormRule<T, T[K]>[] }>;

export interface FormOptions<T extends {}> {
  defaultValues: T;
  rules?: FormRules<T>;
}

export interface FormStore<T extends {}> {
  values: T;
  errors: FormErrors<T>;
  recheck: boolean;
}

export interface Form<T extends {}> {
  values: Accessor<T>;
  errors: Accessor<Readonly<FormErrors<T>>>;
  isDirty: Accessor<boolean>;
  isValid: Accessor<boolean>;
  handlers: Readonly<FormHandlers<T>>;
  setErrors: (errors: Readonly<FormErrors<T>>) => void;
  wrapSubmit: (callback: (values: T) => void) => (event?: SubmitEvent) => void;
  trigger: () => Readonly<FormErrors<T>>;
  reset: (updates?: Partial<T>) => void;
}
