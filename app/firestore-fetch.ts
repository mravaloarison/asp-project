import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import { ZoneDocument, UserDocument, LocationDocument } from "@/app/firestore";

const db = getFirestore();

export async function getAllZones(): Promise<ZoneDocument[]> {
  const snapshot = await getDocs(collection(db, "zones"));
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as ZoneDocument)
  );
}

export async function getZoneById(zoneId: string): Promise<ZoneDocument | null> {
  const docRef = doc(db, "zones", zoneId);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as ZoneDocument) : null;
}

export async function getAllUsers(): Promise<UserDocument[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(
    (d) => ({ uid: d.id, ...d.data() } as UserDocument)
  );
}

export async function getUserById(userId: string): Promise<UserDocument | null> {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserDocument) : null;
}

export async function getUsersByZoneId(zoneId: string): Promise<UserDocument[]> {
  const q = query(
    collection(db, "users"),
    where("assignedZoneIds", "array-contains", zoneId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ uid: d.id, ...d.data() } as UserDocument)
  );
}

export async function getAllLocations(): Promise<LocationDocument[]> {
  const snapshot = await getDocs(collection(db, "locations"));
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as LocationDocument)
  );
}

export async function getLocationsByUserId(userId: string): Promise<LocationDocument[]> {
  const q = query(collection(db, "locations"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as LocationDocument)
  );
}