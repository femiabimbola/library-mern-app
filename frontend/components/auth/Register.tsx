"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(), //turns a string to a number
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

const Register = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      universityId: 0,
      universityCard: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {};

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        Create your library account
      </h1>
      <p className="text-white/80">
        Please complete all fields and upload a valid university ID to gain
        access to the library
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
              control={form.control}
              name="fullName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // disabled={isPending}
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </form>
      </Form>
    </div>
  );
};

export default Register;
