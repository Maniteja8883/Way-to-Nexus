"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Persona } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(16, "Age must be at least 16.").max(100),
  occupation: z.string().min(2, "Occupation is required."),
  industry: z.string().min(2, "Industry is required."),
  goals: z.string().min(10, "Goals must be at least 10 characters.").max(200),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to persona storage." }),
  }),
});

type CreatePersonaFormValues = z.infer<typeof formSchema>;

interface CreatePersonaFormProps {
  onPersonaCreate: (data: Omit<Persona, 'id'>) => void;
}

export function CreatePersonaForm({ onPersonaCreate }: CreatePersonaFormProps) {
  const form = useForm<CreatePersonaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      occupation: "",
      industry: "",
      goals: "",
    },
  });

  function onSubmit(values: CreatePersonaFormValues) {
    onPersonaCreate(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Aspiring Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Current/Target Occupation</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Product Manager" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Fintech" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Career Goals</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your career aspirations..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Consent to Storage</FormLabel>
                <FormDescription>
                  I consent to storing my persona for personalized recommendations. 
                  Read our <Link href="/privacy" className="underline hover:text-primary">privacy policy</Link>.
                </FormDescription>
                 <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Create Persona</Button>
      </form>
    </Form>
  );
}
