const RAILRADAR_BASE_URL = "https://api.railradar.in/v1";

interface RailRadarRouteStop {
  sequence: number;
  code: string;
  name: string;
  lat?: number;
  lng?: number;
}

interface RailRadarRouteResponse {
  success: boolean;
  data?: {
    trainNumber: string;
    format: string;
    stops?: RailRadarRouteStop[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface TrainRouteStop {
  sequence: number;
  code: string;
  name: string;
  lat?: number;
  lng?: number;
}

export interface TrainRouteResult {
  trainNumber: string;
  stops: TrainRouteStop[];
}

export async function fetchTrainRoute(
  trainNumber: string
): Promise<TrainRouteResult> {
  if (!trainNumber) {
    throw new Error("Train number is required.");
  }

  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const response = await fetch(
    `${RAILRADAR_BASE_URL}/trains/${encodeURIComponent(
      trainNumber
    )}/route?format=geojson&stops=true`,
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
    throw new Error("Route information is not available for this train.");
  }

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!response.ok) {
    throw new Error(
      `RailRadar route lookup failed with status ${response.status}.`
    );
  }

  const data: RailRadarRouteResponse = await response.json();

  if (!data.success || !data.data) {
    throw new Error(
      data.error?.message ?? "Unable to load train route information."
    );
  }

  return {
    trainNumber: data.data.trainNumber,
    stops: data.data.stops ?? [],
  };
}
