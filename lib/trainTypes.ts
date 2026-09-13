export interface TrainResult {
  trainNumber: string;
  trainName: string;

  source: {
    code: string;
    name: string;
    departure: string;
  };

  destination: {
    code: string;
    name: string;
    arrival: string;
  };

  duration: string;

  trainType: string;

  runsOn: string[];

  classes: string[];

  distance?: string;
}
