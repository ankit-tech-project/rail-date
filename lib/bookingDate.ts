const ADVANCE_RESERVATION_DAYS = 60;

export interface BookingDateResult {
  journeyDate: Date;
  bookingDate: Date;
  daysUntilBooking: number;
  isBookingToday: boolean;
  isBookingTomorrow: boolean;
  isBookingFuture: boolean;
  isBookingPast: boolean;
  isJourneyToday: boolean;
}

function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function differenceInDays(date1: Date, date2: Date): number {
  const first = startOfDay(date1);
  const second = startOfDay(date2);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.round(
    (first.getTime() - second.getTime()) / millisecondsPerDay
  );
}

export function calculateBookingDate(
  journeyDateString: string
): BookingDateResult {
  const journeyDate = parseDate(journeyDateString);

  const today = startOfDay(new Date());

  const normalizedJourneyDate = startOfDay(journeyDate);

  const bookingDate = addDays(
    normalizedJourneyDate,
    -ADVANCE_RESERVATION_DAYS
  );

  const daysUntilBooking = differenceInDays(
    bookingDate,
    today
  );

  return {
    journeyDate: normalizedJourneyDate,

    bookingDate,

    daysUntilBooking,

    isBookingToday: daysUntilBooking === 0,

    isBookingTomorrow: daysUntilBooking === 1,

    isBookingFuture: daysUntilBooking > 1,

    isBookingPast: daysUntilBooking < 0,

    isJourneyToday:
      differenceInDays(
        normalizedJourneyDate,
        today
      ) === 0,
  };
}