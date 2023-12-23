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
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState, useEffect } from "react";

type OrderWithoutId = Omit<Order, "order_id" | "car">;

const formSchema = z.object({
  car_id: z.string({ required_error: "Car is required" }),
  order_date: z.date({ required_error: "Order date is required" }),
  pickup_date: z.date({ required_error: "Pickup date is required" }),
  pickup_location: z.string().min(10, {
    message: "Pickup location must be at least 10 characters.",
  }),
  dropoff_date: z.date({ required_error: "Pickup date is required" }),
  dropoff_location: z.string().min(10, {
    message: "Dropoff location must be at least 10 characters.",
  }),
});
const getTomorrow = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};
export default function CreateOrderPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const fetchCars = async () => {
    const { data } = await axios.get<Car[]>(
      "https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars"
    );
    let availableCar = data.filter((car) => car.orders.length === 0);
    setCars(availableCar);
  };

  useEffect(() => {
    fetchCars();
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      car_id: "",
      order_date: new Date(),
      pickup_date: new Date(),
      pickup_location: "",
      dropoff_date: getTomorrow(),
      dropoff_location: "",
    },
  });
  const handlePostOrder = async (orderData: OrderWithoutId) => {
    try {
      const response = await axios.post(
        "https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/orders",
        orderData
      );

      console.log("Order added successfully:", response.data);
      router.push(`/orders`);
    } catch (error) {
      console.error(error);
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    let order_date = new Date(values.order_date);
    let pickup_date = new Date(values.pickup_date);
    let dropoff_date = new Date(values.dropoff_date);
    let obj = {
      ...values,
      order_date: order_date.toISOString(),
      pickup_date: pickup_date.toISOString(),
      dropoff_date: dropoff_date.toISOString(),
      car_id: parseInt(values.car_id),
    };
    handlePostOrder(obj);
  }
  return (
    <main>
      <Title text="Create Order" />
      <div className="border rounded-lg p-8">
        <p className="text-center font-bold uppercase mb-4">Form Create Order</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="order_date"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-x-5 ">
              <div className="flex flex-row gap-x-5 ">
                <div>
                  <FormField
                    control={form.control}
                    name="pickup_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pickup Date</FormLabel>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickup_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
                        <FormControl>
                          <Input placeholder="pickup location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="dropoff_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Dropoff Date</FormLabel>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dropoff_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dropoff Location</FormLabel>
                        <FormControl>
                          <Input placeholder="dropoff location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="car_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Available Cars</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className=" h-[6.5rem]">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[400px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <>
                                  <img
                                    src={
                                      cars.find(
                                        (car) => car.car_id.toString() === field.value
                                      )?.image
                                    }
                                    width={100}
                                    height={60}
                                  />
                                  {
                                    cars.find(
                                      (car) => car.car_id.toString() === field.value
                                    )?.car_name
                                  }
                                </>
                              ) : (
                                "Select Car"
                              )}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search car..." className="h-9" />
                            <CommandEmpty>No car found.</CommandEmpty>
                            <CommandGroup>
                              {cars.map((car) => (
                                <CommandItem
                                  value={car.car_name}
                                  key={car.car_id}
                                  onSelect={() => {
                                    form.setValue("car_id", car.car_id.toString());
                                  }}
                                >
                                  <div className="flex flex-row gap-x-4">
                                    <img
                                      src={car.image}
                                      alt={car.car_name}
                                      width={30}
                                      height={15}
                                    />
                                    {car.car_name}
                                  </div>
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      car.car_id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
