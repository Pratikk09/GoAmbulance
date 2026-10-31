type DriverAvailability = 'AVAILABLE' | 'OFFLINE';

interface IGeoPoint {
  latitude: number;
  longitude: number;
  mapsLink?: string;
}

// Offer object from GET /ambulance/driver/offer and the `ambulance:offer` socket event.
interface IAmbulanceOffer {
  caseId: string;
  severity: string;
  triageSummary: string;
  patientName: string;
  pickup: IGeoPoint;
  distanceKm: number;
  expiresAt: string;
  offerTimeoutSeconds: number;
}

interface IAmbulanceTrip {
  caseId: string;
  ambulanceStatus: string;
  caseStatus: string;
  severity: string;
  triageSummary: string;
  clinicName: string;
  patient: {name: string; phone: string};
  doctorName: string | null;
  condition: string | null;
  referralStatus: string;
  pickup: IGeoPoint;
  destination:
    | (IGeoPoint & {hospitalName: string; source: string; confirmed: boolean})
    | null;
  timestamps: {[key: string]: string | null};
  etaMinutes?: number;
}

interface DriverMeRes {
  ambulance: any;
  driver: any;
  activeTrip: IAmbulanceTrip | null;
  offer: IAmbulanceOffer | null;
}

interface DriverStatusBody {
  status: DriverAvailability;
  latitude?: number;
  longitude?: number;
}

interface DriverLocationBody {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

interface PushTokenBody {
  token: string;
  platform: 'fcm' | 'expo';
}
