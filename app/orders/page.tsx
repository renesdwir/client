"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Order } from "@/lib/interface";
import axios from "axios";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const fetchOrders = async () => {
    const { data } = await axios.get<Order[]>(
      "https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/orders"
    );
    setOrders(data);
  };
  const handleDeleteCar = async (id: string | number) => {
    try {
      await axios.delete(
        `https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/orders/${id}`
      );
      console.log("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <main>
      <div className="flex justify-between items-center">
        <Title text="Order Page" />
        <Button onClick={() => router.push("/orders/action")}>+ Add New Order</Button>
      </div>
      <Table className="mt-3">
        <TableCaption>A list of your orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Order Id</TableHead>
            <TableHead className="text-center">Car</TableHead>
            <TableHead className="text-center">Car Name</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Rental Duration</TableHead>
            <TableHead className="text-center">Pickup Location</TableHead>
            <TableHead className="text-center">Dropoff Location</TableHead>
            <TableHead className=" text-center"></TableHead>
            <TableHead className=" text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell className="font-medium text-center">{order.order_id}</TableCell>
              <TableCell className="flex justify-center items-center">
                <img
                  src={order.car.image}
                  alt={order.car.car_name}
                  width={100}
                  height={40}
                />
              </TableCell>
              <TableCell className="text-center">{order.car.car_name}</TableCell>
              <TableCell className="text-center">
                {order.order_date.split("T")[0]}
              </TableCell>
              <TableCell className="text-center">
                {order.pickup_date.split("T")[0]} - {order.dropoff_date.split("T")[0]}
              </TableCell>
              <TableCell className="text-center">{order.pickup_location}</TableCell>
              <TableCell className="text-center">{order.dropoff_location}</TableCell>
              <TableCell className="">
                <Button onClick={() => router.push(`/orders/action/${order.order_id}`)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell className="">
                <Button
                  variant={"destructive"}
                  onClick={() => handleDeleteCar(order.order_id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
