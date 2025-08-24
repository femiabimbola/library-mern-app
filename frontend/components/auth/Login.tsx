"use client";

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
import { useState, useTransition } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginFetcher = async (url: string, { arg }: { arg: z.infer<typeof LogInSchema> }) => {
  const response = await axios.post(url, arg, { withCredentials: true });
  return response.data;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();


  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { trigger, isMutating, error: swrError } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
    loginFetcher
  );

  // const onSubmit = (values: z.infer<typeof LogInSchema>) => {
  //   console.log(values);
  //   setError("");
  //   startTransition(async() => {
  //     try {
  //       const {data} = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, values, {withCredentials:true})
  //       console.log(data)
  //       router.push("/dashboard");
  //     } catch (error:any) {
  //       setError(error.response.data.message)
  //     }
  //   })
  // };

  const onSubmit = async (values: z.infer<typeof LogInSchema>) => {
    setError("");
    try {
      const data = await trigger(values);
      console.log("Login response:", data);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || swrError?.message || "An unexpected error occurred";
      setError(errorMessage);
      console.error("Login error:", error);
    }
  }


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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="form-input bg-[#060911]"
                    placeholder="Enter your email address"
                    type=""
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
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button type="submit" className="w-full cursor-pointer" disabled={isMutating}>
          {isMutating ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>
      <p className="text-center font-medium text-white/60">
      New to BookWise? 
      <a className="font-bold" href="/auth/register"> Create an account </a>
      </p>
    </div>
  );
};

export default Login;
