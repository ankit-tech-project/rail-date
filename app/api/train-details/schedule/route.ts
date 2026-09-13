import { NextRequest, NextResponse } from "next/server";
import { fetchTrainSchedule } from "@/lib/trainScheduleApi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const trainNumber = searchParams.get("trainNumber")?.trim();

    if (!trainNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Train number is required.",
        },
        { status: 400 }
      );
    }

    const schedule = await fetchTrainSchedule(trainNumber);

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("Train schedule API error:", error);

    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Schedule information is temporarily unavailable. Please try again shortly.",
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
            : "Unable to fetch train schedule information.",
      },
      { status: 500 }
    );
  }
}
