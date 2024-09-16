# solid-create-form

A tiny (~644 B) Solid utility to control forms.

Please note, this library assumes that `onChange` has the following interface: `(value: T) => void;`. So if your
controls call onChange with event instead of new value, you may need write some simple wrapper for form handlers.

## Usage

```typescript jsx
import { createForm } from 'solid-create-form';

import { Input } from 'custom/Input';

interface FormValues {
  login: string;
  password: string;
}

export function ExampleForm() {
  const onSubmit = (data: FormValues) => console.log(data);

  const { values, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { login: '', password: '' },
  });

  return (
    <form onSubmit={wrapSubmit(onSubmit)}>
      <Input
        placeholder="Login"
        value={values().login}
        onChange={handlers.login}
      />
      <Input
        placeholder="Password"
        type="password"
        value={values().password}
        onChange={handlers.password}
      />
      <input type="submit" />
    </form>
  );
}
```

### Validation rules

You can set validation rules for each field:

```typescript jsx
function required(value: string): boolean | string {
  return !!value.trim() || 'Required field';
}

const {} = createForm<FormValues>({
  defaultValues: { login: '', password: '' },
  rules: { login: [required], password: [required] }
});
```

All rules will be checked on first submit event. After that any changes will trigger revalidation for changed field.

Rule function takes two arguments, value of current field and values of all fields. So, you can compare different
fields, for example in create or change password form:

```typescript jsx
function samePassword(confirm: string, values: FormValues): boolean | string {
  return confirm === values.password || 'Passwords do not match. Please try again.';
}

const {} = createForm<FormValues>({
  defaultValues: { password: '', confirm: '' },
  rules: { password: [required], confirm: [samePassword] },
});
```

Please note that values object contains previous value of current field during revalidation.

### Set errors manually

For example for errors that comes from server.

```typescript jsx
const { setErrors } = createForm<FormValues>();
const someAction = () => {
  setErrors({ password: 'Some error text' });
};
```

### Checking that form has changed values

```typescript jsx
const { isDirty } = createForm<FormValues>();
<input type="submit" disabled={!isDirty()} />
```

### Checking that form data is valid

```typescript jsx
const { isValid } = createForm<FormValues>();
<input type="submit" disabled={!isValid()} />
```

### Resetting form values

```typescript jsx
const { reset } = createForm<FormValues>();
<input type="button" onClick={() => reset()}>Reset</input>
```

With reset function you can set new initial values:

```typescript jsx
const { reset } = createForm<FormValues>();
<input type="button" onClick={() => reset({ field: 'new value' })}>Reset</input>
```
