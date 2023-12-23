export interface Order {
  order_id: number;
  order_date: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_location: string;
  dropoff_location: string;
  car_id: number;
  car: Car;
}

export interface Car {
  car_id: number;
  car_name: string;
  day_rate: number;
  month_rate: number;
  image: string;
  orders: Order[];
}
