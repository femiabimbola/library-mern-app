import {
  Form, FormControl,  FormField, FormItem, FormLabel,
  FormMessage,} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm,UseFormReturn} from "react-hook-form";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(),//turns a string to a number
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});


const Register = () => {

  // const form: UseFormReturn<T> = useForm({
  //   resolver: zodResolver(signUpSchema),
  //   // defaultValues: defaultValues as DefaultValues<T>,
  // });


  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
         Create your library account
      </h1>
      <p className="text-white-200">
        Please complete all fields and upload a valid university ID to gain access to the library
      </p>
      {/* <Form {...form}>

      </Form> */}
    </div>
  )
}

export default Register