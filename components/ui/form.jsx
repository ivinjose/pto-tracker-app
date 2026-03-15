import { FormProvider } from "react-hook-form";

export function Form({ children, ...props }) {
    return <FormProvider {...props}>{children}</FormProvider>;
}