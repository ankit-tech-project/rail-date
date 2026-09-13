const RAILRADAR_BASE_URL = "https://api.railradar.in/v1";

const FALLBACK_CLASS_CODES = ["SL", "3A", "2A", "1A", "CC", "EC", "2S"];

interface RailRadarPrsTrain {
  name: string;
  type: string;
  classes?: string[];
  runsOn?: string[];
}

interface RailRadarPrsResponse {
  success: boolean;
  data?: Record<string, RailRadarPrsTrain>;
  error?: {
    code: string;
    message: string;
  };
}

interface RailRadarFareBreakdown {
  baseFare?: number;
  reservationCharge?: number;
  superfastCharge?: number;
  otherCharge?: number;
  tatkalFare?: number;
  goodsServiceTax?: number;
  cateringCharge?: number;
  dynamicFare?: number;
  totalFare?: number;
  fuelAmount?: number;
  totalConcession?: number;
  wpServiceTax?: number;
}

interface RailRadarFareResponse {
  success: boolean;
  data?: {
    trainNumber: string;
    trainName: string;
    sourceStation: string;
    destinationStation: string;
    classCode: string;
    quotaCode: string;
    totalFare?: number;
    breakdown?: RailRadarFareBreakdown;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface TrainFareResult {
  classCode: string;
  totalFare: number;
  breakdown?: RailRadarFareBreakdown;
}

export interface TrainFareSearchResult {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  quotaCode: string;
  classes: string[];
  fares: TrainFareResult[];
}

function getQuotaCode(quota: string): string {
  switch (quota) {
    case "tatkal":
      return "TQ";

    case "premium-tatkal":
      return "PT";

    case "general":
    default:
      return "GN";
  }
}

async function getPrsTrainClasses(trainNumber: string): Promise<{
  name: string;
  classes: string[];
}> {
  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const response = await fetch(`${RAILRADAR_BASE_URL}/lookup/trains/prs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(
      `RailRadar PRS lookup failed with status ${response.status}.`
    );
  }

  const data: RailRadarPrsResponse = await response.json();

  if (!data.success || !data.data) {
    throw new Error(
      data.error?.message ?? "Unable to load train class information."
    );
  }

  const train = data.data[trainNumber];

  if (!train) {
    throw new Error(`Train ${trainNumber} was not found in the PRS directory.`);
  }

  return {
    name: train.name,
    classes: train.classes ?? [],
  };
}

async function getFareForClass({
  trainNumber,
  source,
  destination,
  journeyDate,
  classCode,
  quotaCode,
}: {
  trainNumber: string;
  source: string;
  destination: string;
  journeyDate: string;
  classCode: string;
  quotaCode: string;
}): Promise<TrainFareResult | null> {
  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    throw new Error("RAILRADAR_API_KEY is not configured.");
  }

  const params = new URLSearchParams({
    source,
    destination,
    journeyDate,
    classCode,
    quotaCode,
  });

  const response = await fetch(
    `${RAILRADAR_BASE_URL}/trains/${encodeURIComponent(
      trainNumber
    )}/fare?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    /*
     * A particular class may not have fare data for this
     * train / route / quota. We don't want one unavailable
     * class to break the entire Classes & Fare section.
     */
    if (response.status === 400 || response.status === 404) {
      return null;
    }

    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }

    throw new Error(
      `RailRadar fare lookup failed with status ${response.status}.`
    );
  }

  const data: RailRadarFareResponse = await response.json();

  if (!data.success || !data.data) {
    return null;
  }

  return {
    classCode,
    totalFare: data.data.totalFare ?? data.data.breakdown?.totalFare ?? 0,
    breakdown: data.data.breakdown,
  };
}

export async function fetchTrainFares({
  trainNumber,
  source,
  destination,
  journeyDate,
  quota,
}: {
  trainNumber: string;
  source: string;
  destination: string;
  journeyDate: string;
  quota: string;
}): Promise<TrainFareSearchResult> {
  if (!trainNumber) {
    throw new Error("Train number is required.");
  }

  if (!source) {
    throw new Error("Source station is required.");
  }

  if (!destination) {
    throw new Error("Destination station is required.");
  }

  if (!journeyDate) {
    throw new Error("Journey date is required.");
  }

  const quotaCode = getQuotaCode(quota);

  const prsTrain = await getPrsTrainClasses(trainNumber);

  const classCodes = Array.from(
    new Set(
      prsTrain.classes.length > 0 ? prsTrain.classes : FALLBACK_CLASS_CODES
    )
  );

  const fares: TrainFareResult[] = [];

  for (const classCode of classCodes) {
    try {
      const fare = await getFareForClass({
        trainNumber,
        source,
        destination,
        journeyDate,
        classCode,
        quotaCode,
      });

      if (fare) {
        fares.push(fare);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "RATE_LIMITED") {
        console.warn(
          `RailRadar fare rate limit reached while checking ${classCode}.`
        );

        break;
      }

      throw error;
    }
  }

  return {
    trainNumber,
    trainName: prsTrain.name,
    sourceStation: source,
    destinationStation: destination,
    quotaCode,
    classes: fares.map((fare) => fare.classCode),
    fares,
  };
}
