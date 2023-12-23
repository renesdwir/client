"use client";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classNames, rupiah } from "@/lib/utils";
import axios from "axios";
import { Car } from "@/lib/interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const fetchCars = async () => {
    const { data } = await axios.get<Car[]>(
      "https://main--steady-choux-73e324.netlify.app/.netlify/functions/api/cars"
    );
    setCars(data);
  };

  useEffect(() => {
    fetchCars();
  }, []);
  return (
    <main>
      <div className="flex justify-between items-center">
        <Title text="Car Page" />
        <Button onClick={() => router.push("/action")}>+ Add New Car</Button>
      </div>
      <div className=" w-full grid grid-cols-4 gap-3">
        {cars.map((car) => (
          <Card
            className="cursor-pointer relative"
            onClick={() => router.push(`/${car.car_id}`)}
          >
            <Badge
              variant="destructive"
              className={classNames(
                car.orders.length > 0 ? "" : "hidden",
                "right-2 top-2 absolute"
              )}
            >
              Booked
            </Badge>
            <CardHeader>
              <CardTitle>{car.car_name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-x-5">
              <img alt={car.car_name} src={car.image} width={100} height={24} />
              <div className="flex flex-col gap-y-2">
                <div>
                  <p className="text-xs ">Daily Rate</p>
                  <p className="text-sm text-muted-foreground">{rupiah(car.day_rate)}</p>
                </div>
                <div>
                  <p className="text-xs ">Monthly Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {rupiah(car.month_rate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
