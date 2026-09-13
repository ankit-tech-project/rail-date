import type { TrainResult } from "@/lib/trainTypes";

interface RailRadarTrain {
  train: {
    number: string;
    name: string;
    type: string;
    runDays: string[];
  };

  from: {
    departure: string;
    day: number;
    sequence: number;
  };

  to: {
    arrival: string;
    day: number;
    sequence: number;
  };

  distance: number;
  duration: number;
  totalHaltsBetween: number;
}

interface RailRadarResponse {
  success: boolean;

  data?: {
    from: {
      code: string;
      name: string;
    };

    to: {
      code: string;
      name: string;
    };

    count: number;
    trains: RailRadarTrain[];
  };

  error?: {
    code: string;
    message: string;
  };
}

const RAILRADAR_BASE_URL = "https://api.railradar.in/v1";

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatDistance(distance: number): string {
  return Number.isInteger(distance) ? `${distance}` : `${distance.toFixed(1)}`;
}

function normalizeRunDays(runDays: string[]): string[] {
  const dayMap: Record<string, string> = {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
  };

  return runDays.map((day) => dayMap[day.toLowerCase()] ?? day);
}

export async function fetchTrainsBetweenStations(
  fromCode: string,
  toCode: string,
  journeyDate?: string
): Promise<TrainResult[]> {
  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const params = new URLSearchParams();

  if (journeyDate) {
    params.set("date", journeyDate);
  }

  const queryString = params.toString();

  const url =
    `${RAILRADAR_BASE_URL}/trains/between/` +
    `${encodeURIComponent(fromCode)}/` +
    `${encodeURIComponent(toCode)}` +
    `${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: {
      revalidate: 86400,
    },
  });

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!response.ok) {
    throw new Error(`RailRadar request failed with status ${response.status}.`);
  }

  const data: RailRadarResponse = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Unable to retrieve train data.");
  }

  return data.data.trains.map((item) => ({
    trainNumber: item.train.number,
    trainName: item.train.name,

    source: {
      code: data.data!.from.code,
      name: data.data!.from.name,
      departure: item.from.departure,
    },

    destination: {
      code: data.data!.to.code,
      name: data.data!.to.name,
      arrival: item.to.arrival,
    },

    duration: formatDuration(item.duration),

    trainType: item.train.type,

    runsOn: normalizeRunDays(item.train.runDays),

    classes: [],

    distance: formatDistance(item.distance),
  }));
}
