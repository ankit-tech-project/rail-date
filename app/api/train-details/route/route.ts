import { NextRequest, NextResponse } from "next/server";
import { fetchTrainRoute } from "@/lib/trainRouteApi";

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

    const route = await fetchTrainRoute(trainNumber);

    return NextResponse.json({
      success: true,
      data: route,
    });
  } catch (error) {
    console.error("Train route API error:", error);

    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Route information is temporarily unavailable. Please try again shortly.",
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
            : "Unable to fetch train route information.",
      },
      { status: 500 }
    );
  }
}
