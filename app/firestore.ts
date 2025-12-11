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
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LocationDocument {
  id: string;
  userId: string;
  name: string;
  zone?: string;
  address?: string;
  description?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
