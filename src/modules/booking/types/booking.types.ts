export default interface IBooking {
  id?: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  status?: string;
  created_at?: Date;
}


export interface ICreateBookingRes extends IBooking {
  vehicle: {
    vehicle_name: string;
    daily_rent_price: number;
  };
}

export interface IUpdateBookingPayload {
  status: string;
  bookingId: number;
}

