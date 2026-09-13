interface RailRadarStation {
  code: string;
  name: string;
  city: string;
}

interface RailRadarStationResponse {
  success: boolean;

  data?: RailRadarStation[];

  error?: {
    code: string;
    message: string;
  };
}

const RAILRADAR_BASE_URL = "https://api.railradar.in/v1";

export interface StationSearchResult {
  code: string;
  name: string;
  location: string;
}

export async function searchStations(
  query: string
): Promise<StationSearchResult[]> {
  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const params = new URLSearchParams({
    q: query,
    limit: "10",
  });

  const response = await fetch(
    `${RAILRADAR_BASE_URL}/lookup/search/stations?${params.toString()}`,
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

  if (!response.ok) {
    throw new Error(
      `RailRadar station search failed with status ${response.status}.`
    );
  }

  const data: RailRadarStationResponse = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Unable to search stations.");
  }

  return data.data.map((station) => ({
    code: station.code,
    name: station.name,
    location: station.city ?? "",
  }));
}
