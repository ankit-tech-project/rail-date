const RAILRADAR_BASE_URL = "https://api.railradar.in/v1";

interface RailRadarScheduleStation {
  stationCode: string;
  stationName: string;
  sequence: number;
  scheduledArrival?: number | null;
  scheduledDeparture?: number | null;
  actualArrival?: string | null;
  actualDeparture?: string | null;
  delayMinutes?: number | null;
  isHalt?: boolean | number | string;
  platform?: string | null;
}

interface RailRadarScheduleResponse {
  success: boolean;
  data?: {
    train?: {
      number: string;
      name: string;
      type?: string;
      sourceCode?: string;
      destinationCode?: string;
    };
    route?: RailRadarScheduleStation[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface TrainScheduleStop {
  sequence: number;
  code: string;
  name: string;
  arrival: number | null;
  departure: number | null;
  platform: string | null;
  isHalt: boolean;
}

export interface TrainScheduleResult {
  trainNumber: string;
  stops: TrainScheduleStop[];
}

export async function fetchTrainSchedule(
  trainNumber: string
): Promise<TrainScheduleResult> {
  if (!trainNumber) {
    throw new Error("Train number is required.");
  }

  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const response = await fetch(
    `${RAILRADAR_BASE_URL}/legacy/trains/${encodeURIComponent(
      trainNumber
    )}?dataType=full`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: 86400,
      },
    }
  );

  if (response.status === 404) {
    throw new Error("Schedule information is not available for this train.");
  }

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!response.ok) {
    throw new Error(
      `RailRadar schedule lookup failed with status ${response.status}.`
    );
  }

  const data: RailRadarScheduleResponse = await response.json();

  if (!data.success || !data.data) {
    throw new Error(
      data.error?.message ?? "Unable to load train schedule information."
    );
  }

  const route = data.data.route ?? [];

  return {
    trainNumber: data.data.train?.number ?? trainNumber,
    stops: route.map((stop) => ({
      sequence: stop.sequence,
      code: stop.stationCode,
      name: stop.stationName,
      arrival: stop.scheduledArrival ?? null,
      departure: stop.scheduledDeparture ?? null,
      platform: stop.platform ?? null,
      isHalt: stop.isHalt === true || stop.isHalt === 1 || stop.isHalt === "1",
    })),
  };
}
