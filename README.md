### Geospatial User Dashboard
A web application built with Next.js and Firebase designed for managing user profiles, geographic service zones, and specific location data with real-time synchronization and interactive mapping.

### Key Features
- **Authentication and Identity Management:** Secure user lifecycle management including sign-in, sign-up, and full account deletion capabilities using Firebase Auth.

- **Geospatial Visualization:** Interactive map integration using the Google Maps API to display service zones and user-specific location markers.

- **Real-time Data Synchronization:** Direct integration with Firestore for instant updates to user profiles, zone assignments, and location coordinates.

- **Hierarchical Data Management:** Management of data across three primary layers: Users, Zones (geographic regions), and Locations (specific points of interest).

- Responsive UI Components: High-performance, accessible interface built with Radix UI primitives and Tailwind CSS.

### Technology Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database & Auth: Firebase 12 / Firestore
- Mapping: @vis.gl/react-google-maps
- UI Components: Radix UI Themes, Lucide React
- Animations: Framer Motion

### Data Models
The application utilizes three core document types in Firestore:

- `UserDocument:` Stores authentication metadata, company details, and assigned zone IDs.

- Z`oneDocument:` Defines geographic regions, including coordinates, region names, and assigned user counts.

- `LocationDocument:` Represents specific points on the map linked to a user and a zone, containing precise latitude and longitude coordinates.