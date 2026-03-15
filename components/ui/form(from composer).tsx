import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext?.name ?? '', formState);

  if (!fieldContext) {
    return null;
  }

  return {
    name: fieldContext.name,
    id: itemContext?.id,
    formItemId: itemContext?.id,
    formDescriptionId: itemContext?.formDescriptionId,
    formMessageId: itemContext?.formMessageId,
    ...fieldState,
  };
};

const FormItemContext = React.createContext<{
  id: string;
  formDescriptionId: string;
  formMessageId: string;
} | null>(null);

function FormItem({ className, ...props }: ViewProps) {
  const id = React.useId();
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  return (
    <FormItemContext.Provider
      value={{
        id,
        formDescriptionId,
        formMessageId,
      }}
    >
      <View className={cn('flex flex-col gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Text>) {
  const { error, formItemId } = useFormField() ?? {};

  return (
    <Text
      variant="small"
      nativeID={formItemId}
      className={cn(error && 'text-destructive', className)}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.View>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField() ?? {};

  return (
    <Slot.View
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`
      }
      aria-invalid={!!error}
      nativeID={formItemId}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }: React.ComponentProps<typeof Text>) {
  const { error, formMessageId } = useFormField() ?? {};
  const body = error?.message ?? children;

  if (!body) {
    return null;
  }

  return (
    <Text
      variant="small"
      nativeID={formMessageId}
      className={cn('text-destructive', className)}
      {...props}
    >
      {body}
    </Text>
  );
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField };
