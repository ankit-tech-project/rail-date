import { NextRequest, NextResponse } from "next/server";
import { fetchTrainFares } from "@/lib/trainFareApi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const trainNumber = searchParams.get("trainNumber")?.trim();
    const source = searchParams.get("source")?.trim().toUpperCase();
    const destination = searchParams.get("destination")?.trim().toUpperCase();

    const journeyDate = searchParams.get("journeyDate")?.trim();
    const quota = searchParams.get("quota")?.trim() ?? "general";

    if (!trainNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Train number is required.",
        },
        { status: 400 }
      );
    }

    if (!source || !destination) {
      return NextResponse.json(
        {
          success: false,
          message: "Source and destination station codes are required.",
        },
        { status: 400 }
      );
    }

    if (!journeyDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Journey date is required.",
        },
        { status: 400 }
      );
    }

    const result = await fetchTrainFares({
      trainNumber,
      source,
      destination,
      journeyDate,
      quota,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Train fare API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch train fare information.",
      },
      { status: 500 }
    );
  }
}
