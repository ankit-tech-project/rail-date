import { NextRequest, NextResponse } from "next/server";
import { searchStations } from "@/lib/stationApi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Station search query is required.",
        },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Station search query must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    const stations = await searchStations(query);

    return NextResponse.json({
      success: true,
      data: stations,
    });
  } catch (error) {
    console.error("Station API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to search stations.",
      },
      { status: 500 }
    );
  }
}
