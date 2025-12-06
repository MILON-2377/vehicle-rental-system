export default class BookingHelper {
  // Booking Duration Calculator
  public static bookingDurationCal = (
    rentStartDate: string,
    rentEndDate: string
  ): Record<string, number> => {
    const startDate = new Date(rentStartDate);
    const endDate = new Date(rentEndDate);

    const msPerDay = 1000 * 3600 * 24;
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();

    const bookingDuration = Math.ceil(timeDifferenceMs / msPerDay);

    return { bookingDuration };
  };

  // Booking Price Calculator
  public static bookingPriceCal = (
    perDayRentPrice: number,
    bookingDuration: number
  ): number => {
    return perDayRentPrice * bookingDuration;
  };
}
