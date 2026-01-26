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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "../ui/button";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const LogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginFetcher = async (
  url: string,
  { arg }: { arg: z.infer<typeof LogInSchema> }
) => {
  const response = await axios.post(url, arg, { withCredentials: true });
  return response.data;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const {
  //   trigger,
  //   isMutating,
  //   error: swrError,
  // } = useSWRMutation(
  //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
  //   loginFetcher
  // );

   const {
    trigger,
    isMutating,
    error: swrError,
  } = useSWRMutation('/api/proxy/auth/login', loginFetcher);

  const onSubmit = async (values: z.infer<typeof LogInSchema>) => {
    setError("");
    try {
      await trigger(values);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        swrError?.message ||
        "An unexpected error occurred";
      setError(errorMessage);
      console.error("Login error:", error);
    }
  };

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
                    disabled={isMutating}
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
                  {/* Container must be relative to position the icon */}
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isMutating}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      className="form-input bg-[#060911] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
          {error && <p className="text-red-800 text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isMutating}
          >
            {isMutating ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>
      <p className="text-center font-medium text-white">
        New to BookWise?
        <a className="font-bold" href="/auth/register">
          {" "}
          Create an account{" "}
        </a>
      </p>
      <Link
        className="text-center text-base font-light text-white/50"
        href="/books"
      >
        {" "}
        Return to book
      </Link>
    </div>
  );
};

export default Login;
