"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import Link from "next/link";
import { MediaUpload } from "../MediaUpload1";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces"),
  email: z.string().email("Invalid email address").trim(),
  universityId: z.coerce.number(), //turns a string to a number
  universityCard: z.string().nonempty("University Card is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    setError("");
    startTransition(async () => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, values);
        router.push("/auth/login");
      } catch (error: any) {
        setError(error.response.data.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">Create your library account</h1>
      <p className="text-white/80 mb-3">
        Please complete all fields and upload a valid university ID to gain access to the library
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="form-input bg-[#060911]"
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={isPending}
                    className="form-input bg-[#060911]"
                    placeholder="Enter your email address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="form-input bg-[#060911]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="universityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">University Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="form-input bg-[#060911]"
                    placeholder="Enter your university number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="universityCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">University Card</FormLabel>
                <FormControl>
                  {/* <ImageUpload field={field} /> */}
                  <MediaUpload field={field} folder="/libApp/images" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-white/80">{error}</p>
          <Button type="submit" className="w-full text-white/80 cursor-pointer">
            Sign Up
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-medium text-white/60">
        Already have an BookWise?
        <a className="font-bold text-white/80" href="/auth/login">
          {" "}
          Sign In{" "}
        </a>
      </p>
      <Link  className="text-center text-base font-light text-white/50" href="/books"> Return to book</Link>
    </div>
  );
};

export default Register;
