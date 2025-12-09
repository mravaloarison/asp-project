export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  photoURL?: string;
  department?: string;
  assignedZoneIds: string[];
  createdAt: number;
  lastLogin: number;
}

export interface ZoneDocument {
  id: string;
  name: string;
  region: string;
  assignedUserIds: string[];
  locationCount: number;
}

export interface LocationDocument {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}