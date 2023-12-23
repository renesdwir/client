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
import { Input } from "@/components/ui/input";
import { Car } from "@/lib/interface";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type CarWithoutId = Omit<Car, "car_id" | "orders">;
const formSchema = z.object({
  car_name: z
    .string()
    .min(2, {
      message: "Car name must be at least 2 characters.",
    })
    .max(50, {
      message: "Car name must not exceed 50 characters.",
    }),
  day_rate: z.coerce.number({ required_error: "Day rate is required" }),
  month_rate: z.coerce.number({ required_error: "Month rate is required" }),
  image: z
    .string()
    .min(2, {
      message: "Image Url must be at least 2 characters.",
    })
    .max(256, {
      message: "Image Url must not exceed 256 characters.",
    }),
});

export default function UpdateCarPage() {
  const router = useRouter();
  const params = useParams();
  const fetchCarById = async () => {
    const { data } = await axios.get<Car>(
      `https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars/${params.id}`
    );
    form.setValue("car_name", data.car_name);
    form.setValue("day_rate", data.day_rate);
    form.setValue("month_rate", data.month_rate);
    form.setValue("image", data.image);
  };
  useEffect(() => {
    fetchCarById();
  }, [router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      car_name: "",
      day_rate: 0,
      month_rate: 0,
      image: "",
    },
  });
  const handleUpdateCar = async (carData: CarWithoutId) => {
    try {
      const response = await axios.put(
        `https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars/${params.id}`,
        carData
      );
      console.log("Car updated successfully:", response.data);
      router.push(`/`);
    } catch (error) {
      console.error(error);
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleUpdateCar(values);
  }
  return (
    <main>
      <Title text="Update Car" />
      <div className="border rounded-lg p-8">
        <p className="text-center font-bold uppercase">Form Update</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="car_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input placeholder="your car" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Rate</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="eg. 600000" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rate</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="eg. 600000" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Url</FormLabel>
                  <FormControl>
                    <Input placeholder="car image url" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
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
