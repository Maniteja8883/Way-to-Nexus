
"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Persona } from "@/lib/types";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(16, "Must be at least 16.").max(100, "Must be 100 or younger."),
  location: z.object({
    city: z.string().min(2, "City is required."),
    state: z.string().min(2, "State is required."),
  }),
  educationStage: z.enum(['High School', 'Undergraduate', 'Postgraduate', 'Professional']),
  stream: z.string().min(2, "Stream/major is required."),
  techComfort: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  interests: z.array(z.string()).min(1, "Enter at least one interest.").max(5, "You can add up to 5 interests."),
  goals: z.string().min(10, "Goals must be at least 10 characters.").max(500, "Goals must be under 500 characters."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to persona storage." }),
  }),
});

type CreatePersonaFormValues = z.infer<typeof formSchema>;

interface CreatePersonaFormProps {
  onPersonaCreate: (data: Omit<Persona, 'id'>) => void;
}

export function CreatePersonaForm({ onPersonaCreate }: CreatePersonaFormProps) {
  const [interestInput, setInterestInput] = useState("");

  const form = useForm<CreatePersonaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      location: { city: "", state: "" },
      stream: "",
      interests: [],
      goals: "",
    },
  });

  const interests = form.watch("interests", []);

  const handleAddInterest = () => {
    if (interestInput && interests.length < 5 && !interests.includes(interestInput)) {
      form.setValue("interests", [...interests, interestInput]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    form.setValue("interests", interests.filter(interest => interest !== interestToRemove));
  };


  function onSubmit(values: CreatePersonaFormValues) {
    onPersonaCreate(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Personal Info</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persona Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Aspiring Developer" {...field} aria-label="Persona Name" />
                </FormControl>
                <FormDescription>A name to help you identify this persona.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} aria-label="Age" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mumbai" {...field} aria-label="City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="location.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Maharashtra" {...field} aria-label="State" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Education & Skills */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Education & Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="educationStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Education Stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream / Major</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" {...field} aria-label="Stream or Major" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="techComfort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comfort with Technology</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Comfort with Technology">
                        <SelectValue placeholder="Select comfort level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

         {/* Interests & Goals */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Interests & Goals</h3>
            <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Interests</FormLabel>
                <FormControl>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g., AI, Marketing, Design"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddInterest();
                                }
                            }}
                            aria-label="Add an interest"
                        />
                        <Button type="button" variant="outline" onClick={handleAddInterest} disabled={interests.length >= 5}>
                            Add
                        </Button>
                    </div>
                </FormControl>
                 <FormDescription>Add up to 5 interests.</FormDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                    {interests.map(interest => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <button type="button" onClick={() => handleRemoveInterest(interest)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {interest}</span>
                        </button>
                    </Badge>
                    ))}
                </div>
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
                    <Textarea placeholder="Describe your career aspirations in a few sentences..." {...field} rows={4} aria-label="Career Goals" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>


        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-required="true"
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
        <Button type="submit" size="lg" className="w-full">Create Persona</Button>
      </form>
    </Form>
  );
}
