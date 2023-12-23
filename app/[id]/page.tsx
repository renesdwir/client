"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Car } from "@/lib/interface";
import axios from "axios";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rupiah } from "@/lib/utils";

export default function DetailCar() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car>();
  const fetchCarById = async () => {
    const { data } = await axios.get<Car>(
      `https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars/${params.id}`
    );
    setCar(data);
  };
  const handleDeleteCar = async () => {
    try {
      await axios.delete(
        `https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars/${params.id}`
      );
      console.log("Car deleted successfully");
      router.push(`/`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCarById();
  }, [router]);
  return (
    <main>
      <div className="flex justify-between items-center">
        <Title text="Detail Car Page" />
        <div className="flex gap-x-5">
          <Button onClick={() => router.push(`/action/${params.id}`)}>Edit Car</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"> Delete Car</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-transparent hover:bg-transparent"
                  onClick={handleDeleteCar}
                >
                  <Button variant="destructive"> Delete Car</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <div>
          <div className="flex justify-center">
            <img src={car?.image} alt={car?.car_name} width={300} height={150} />
          </div>
          <div className="mt-3">
            <p className="text-xl font-bold text-center">{car?.car_name}</p>
            <div className="flex flex-row justify-between mt-2">
              <div>
                <p>Daily Rate</p>
                <p className="text-muted-foreground">{rupiah(car?.day_rate || 0)}</p>
              </div>
              <div>
                <p>Monthly Rate</p>
                <p className="text-muted-foreground">{rupiah(car?.day_rate || 0)}</p>
              </div>
            </div>
            <div className="mt-5">
              <Table>
                <TableCaption>A list of orders.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead className="text-center">Rental Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {car?.orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{order.order_date.split("T")[0]}</TableCell>
                      <TableCell>
                        {order.pickup_date.split("T")[0]} -{" "}
                        {order.dropoff_date.split("T")[0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
