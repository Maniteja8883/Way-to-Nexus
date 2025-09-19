

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Persona } from "@/lib/types";
import { X, Info } from "lucide-react";

const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry", "Prefer not to say"];
const educationStages = ['Primary (≤10)', 'Secondary (class 11–12)', 'Undergraduate', 'Postgraduate', 'Working professional', 'Other'] as const;
const streams = ['MPC', 'BPC', 'MEC', 'CEC', 'Vocational', 'Other'] as const;
const interestDomains = ['Engineering', 'AI/ML', 'Design', 'Product', 'Research', 'Arts', 'Entrepreneurship'] as const;
const techComfortLevels = ['Beginner', 'Comfortable', 'Proficient', 'Expert', 'Prefer not to say'] as const;
const learningModes = ['Online courses', 'Hands-on projects', 'Bootcamps', 'College degree', 'Self-study', 'Mentorship'] as const;


const formSchema = z.object({
  name: z.string().min(2, "Persona name is required.").max(60, "Name must be 60 characters or less."),
  age: z.coerce.number().min(5, "Age must be at least 5.").max(100, "Age must be 100 or younger."),
  location: z.object({
    state: z.string().min(1, "State is required."),
    city: z.string().optional(),
  }),
  educationStage: z.enum(educationStages),
  stream: z.array(z.string()).optional(),
  currentCourseOrJob: z.string().optional(),
  careerGoals: z.string().min(1, "Career goal is required."),
  interests: z.array(z.string()).min(1, "Select at least one interest."),
  techComfort: z.enum(techComfortLevels),
  preferredLearningModes: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  constraints: z.string().optional(),
  consentToStore: z.literal(true, {
    errorMap: () => ({ message: "You must consent to persona storage." }),
  }),
  shareAnonymously: z.boolean().optional(),
}).refine(data => !(data.educationStage === 'Secondary (class 11–12)' && (!data.stream || data.stream.length === 0)), {
    message: "Please choose at least one stream.",
    path: ["stream"],
});

type CreatePersonaFormValues = Omit<z.infer<typeof formSchema>, 'careerGoals' | 'skills'> & {
    careerGoals: string;
    skills: string;
};


interface CreatePersonaFormProps {
  onPersonaCreate: (data: Omit<Persona, 'id'>) => void;
}

export function CreatePersonaForm({ onPersonaCreate }: CreatePersonaFormProps) {
  const [interestInput, setInterestInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: '' as unknown as number, // Initialize with empty string to make it controlled
      location: { city: "", state: "" },
      stream: [],
      currentCourseOrJob: "",
      careerGoals: "",
      interests: [],
      skills: [],
      preferredLearningModes: [],
      constraints: "",
      shareAnonymously: false,
    },
  });

  const watchEducationStage = form.watch("educationStage");
  const interests = form.watch("interests", []);
  const skills = form.watch("skills", []);

  const handleAddChip = (field: "interests" | "skills", value: string, setValue: (val:string) => void) => {
    if (value) {
      const currentValues = form.getValues(field) || [];
      if (!currentValues.includes(value)) {
        form.setValue(field, [...currentValues, value]);
      }
      setValue("");
    }
  };

  const handleRemoveChip = (field: "interests" | "skills", valueToRemove: string) => {
    const currentValues = form.getValues(field) || [];
    form.setValue(field, currentValues.filter(v => v !== valueToRemove));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const personaData: Omit<Persona, 'id'> = {
        ...values,
        careerGoals: values.careerGoals.split(',').map(s => s.trim()).filter(Boolean),
        location: {
            state: values.location.state,
            city: values.location.city || null
        },
        currentCourseOrJob: values.currentCourseOrJob || null,
        constraints: values.constraints || null,
        stream: values.educationStage === 'Secondary (class 11–12)' ? values.stream : undefined,
    };
    onPersonaCreate(personaData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
        
        {/* Section 1: Basic identity */}
        <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic identity</h3>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Persona Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Aspiring Developer" {...field} aria-label="persona-name" />
                    </FormControl>
                    <FormDescription>A short name to identify this persona (visible only to you).</FormDescription>
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
                        <Input type="number" placeholder="e.g., 16" {...field} aria-label="Age"/>
                        </FormControl>
                         <FormDescription>Helps customise schooling-level advice.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center">State
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild><Info className="h-3 w-3 ml-1.5 cursor-help"/></TooltipTrigger>
                                    <TooltipContent><p>We personalize exam and college info by state.</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger aria-label="persona-state"><SelectValue placeholder="Select state" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="location.city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>City / Town (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Hyderabad" {...field} />
                    </FormControl>
                    <FormDescription>If empty, we'll provide statewide guidance only.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </section>

        {/* Section 2: Education & career context */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Education & career context</h3>
           <FormField
              control={form.control}
              name="educationStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Education Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="education-stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educationStages.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                    </SelectContent>
                  </Select>
                   <FormDescription>Choose the stage that best matches your current situation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchEducationStage === 'Secondary (class 11–12)' && (
                 <Controller
                    name="stream"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stream / Subjects</FormLabel>
                             <FormDescription>Select all that apply.</FormDescription>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                                {streams.map((stream) => (
                                    <FormField
                                        key={stream}
                                        control={form.control}
                                        name="stream"
                                        render={({ field }) => {
                                            return (
                                                <FormItem key={stream} className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(stream)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                ? field.onChange([...(field.value || []), stream])
                                                                : field.onChange(field.value?.filter((value) => value !== stream))
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{stream}</FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
             {(watchEducationStage === 'Undergraduate' || watchEducationStage === 'Postgraduate' || watchEducationStage === 'Working professional') && (
                <FormField
                    control={form.control}
                    name="currentCourseOrJob"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Current Course / Job Title (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., B.Tech CSE or Research Assistant" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             )}
            <FormField
                control={form.control}
                name="careerGoals"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center">Current / Target Occupation (Career Goal)
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="h-3 w-3 ml-1.5 cursor-help"/></TooltipTrigger>
                                <TooltipContent><p>You can write multiple roles separated by a comma.</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Product Manager, Data Scientist" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </section>

        {/* Section 3: Preferences & skills */}
        <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Preferences & skills</h3>
            <FormItem>
                <FormLabel>Interest Domains</FormLabel>
                 <div className="flex flex-wrap gap-2 pt-2">
                    {interestDomains.map(item => (
                        <Button key={item} type="button" variant={interests.includes(item) ? "default" : "secondary"} onClick={() => {
                            const current = interests;
                            const newInterests = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                            form.setValue("interests", newInterests, { shouldValidate: true });
                        }}>{item}</Button>
                    ))}
                </div>
                 <FormControl>
                    <div className="flex gap-2 mt-2">
                        <Input
                            placeholder="Add custom interest"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddChip("interests", interestInput, setInterestInput);
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={() => handleAddChip("interests", interestInput, setInterestInput)}>Add</Button>
                    </div>
                </FormControl>
                <div className="flex flex-wrap gap-2 pt-2">
                    {interests.filter(i => !interestDomains.includes(i as any)).map(interest => (
                        <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                            {interest}
                            <button type="button" onClick={() => handleRemoveChip("interests", interest)} className="rounded-full hover:bg-muted-foreground/20 p-0.5"><X className="h-3 w-3" /></button>
                        </Badge>
                    ))}
                </div>
                <FormMessage>{form.formState.errors.interests?.message}</FormMessage>
            </FormItem>
            <FormField
                control={form.control}
                name="techComfort"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tech Comfort Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select comfort level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {techComfortLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormDescription>This helps us recommend appropriate starting resources.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Controller
                name="preferredLearningModes"
                control={form.control}
                render={() => (
                    <FormItem>
                        <FormLabel>Preferred Learning Modes (Optional)</FormLabel>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                            {learningModes.map((mode) => (
                                <FormField
                                    key={mode}
                                    control={form.control}
                                    name="preferredLearningModes"
                                    render={({ field }) => {
                                        return (
                                            <FormItem key={mode} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(mode)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                            ? field.onChange([...(field.value || []), mode])
                                                            : field.onChange(field.value?.filter((value) => value !== mode))
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{mode}</FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    </FormItem>
                )}
            />
             <FormItem>
                <FormLabel>Skills / Strengths (Optional)</FormLabel>
                <FormControl>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g., Python, Public speaking"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddChip("skills", skillInput, setSkillInput);
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={() => handleAddChip("skills", skillInput, setSkillInput)}>Add</Button>
                    </div>
                </FormControl>
                <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button type="button" onClick={() => handleRemoveChip("skills", skill)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
            </FormItem>
            <FormField
                control={form.control}
                name="constraints"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Constraints / Notes (Optional)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., I cannot relocate or Prefer low-cost courses" {...field} />
                    </FormControl>
                     <FormDescription>This helps tailor college/region suggestions.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </section>

        {/* Consent Section */}
        <section className="space-y-4">
            <FormField
                control={form.control}
                name="consentToStore"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-required="true" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Consent to Storage</FormLabel>
                        <FormDescription>
                        I consent to storing my persona for personalized recommendations.
                        Read our <Link href="/privacy" className="underline hover:text-primary" target="_blank">privacy policy</Link>.
                        </FormDescription>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="shareAnonymously"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Share Anonymously (Optional)</FormLabel>
                        <FormDescription>Allow anonymous sharing of persona insights for research.</FormDescription>
                    </div>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    </FormItem>
                )}
                />
        </section>

        <Button type="submit" size="lg" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
            Create Persona
        </Button>
      </form>
    </Form>
  );
}

    
