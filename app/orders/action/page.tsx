"use client";
import Title from "@/components/Title";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Car, Order } from "@/lib/interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type OrderWithoutId = Omit<Order, "order_id" | "car">;

const formSchema = z.object({
  // car_id: z.string({ required_error: "Car is required" }),
  order_date: z.date({ required_error: "Order date is required" }),
  // pickup_date: z.date({ required_error: "Pickup date is required" }),
  // pickup_location: z.string().min(10, {
  //   message: "Pickup location must be at least 10 characters.",
  // }),
  // dropoff_date: z.date({ required_error: "Pickup date is required" }),
  // dropoff_location: z.string().min(10, {
  //   message: "Dropoff location must be at least 10 characters.",
  // }),
});
export default function CreateOrderPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // car_id: "",
      order_date: new Date(),
      // pickup_date: new Date(),
      // pickup_location: "",
      // dropoff_date: new Date(),
      // dropoff_location: "",
    },
  });
  const handlePostCar = async (carData: OrderWithoutId) => {
    try {
      const response = await axios.post(
        "https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars",
        carData
      );

      console.log("Car added successfully:", response.data);
      router.push(`/`);
    } catch (error) {
      console.error(error);
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    let test = new Date(values.order_date);
    console.log(test.toISOString());
    // handlePostCar(values);
  }
  return (
    <main>
      <Title text="Create Order" />
      <div className="border rounded-lg p-8">
        <p className="text-center font-bold uppercase">Form Create Order</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="order_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Order Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
