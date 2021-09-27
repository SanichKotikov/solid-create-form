export type FormErrors<T extends {}> = Partial<Record<keyof T, string>>;
export type FormHandlers<T extends {}> = { [K in keyof T]: (value: T[K]) => void };
export type FormRule<V = unknown> = (value: V) => boolean | string;
export type FormRules<T extends {}> = Partial<{ [K in keyof T]: readonly FormRule<T[K]>[] }>;
export type FormValidateResult = string | undefined;

export interface FormOptions<T extends {}> {
  defaultValues: T;
  rules?: FormRules<T>;
}
