import { NextRequest, NextResponse } from "next/server";
import { fetchTrainsBetweenStations } from "@/lib/trainApi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from")?.trim().toUpperCase();
    const to = searchParams.get("to")?.trim().toUpperCase();
    const date = searchParams.get("date")?.trim();

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          message: "From and to station codes are required.",
        },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        {
          success: false,
          message: "From and to stations must be different.",
        },
        { status: 400 }
      );
    }

    const trains = await fetchTrainsBetweenStations(
      from,
      to,
      date || undefined
    );

    return NextResponse.json({
      success: true,
      data: trains,
    });
  } catch (error) {
    console.error("Train API error:", error);

    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Train search is temporarily unavailable because the data provider has reached its request limit. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch train data.",
      },
      { status: 500 }
    );
  }
}
