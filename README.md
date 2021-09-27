# solid-create-form

A tiny (~525 B) Solid utility to control forms.

## Usage

```typescript jsx
import { createSignal } from 'solid-js';
import { createForm } from 'solid-create-form';

import { Input } from 'custom/Input';

interface FormValues {
  login: string;
  password: string;
}

export function ExampleForm() {
  const [result, setResult] = createSignal('');
  const onSubmit = (data: FormValues) => setResult(JSON.stringify(data));

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
      <p>{result}</p>
      <input type="submit" />
    </form>
  );
}
```
