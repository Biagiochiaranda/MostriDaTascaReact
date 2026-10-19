# Mostri da Tasca — React Native

**A location-based mobile game built with React Native and Expo.**

Mostri da Tasca brings game interactions onto a real-world map. Players can explore nearby virtual objects and other users, inspect collectibles, interact with monsters, develop a player profile, and compare their progress through a ranking system.

## Highlights

- **Interactive map:** display the player's position and location-based markers for objects and other users.
- **Item discovery:** browse nearby objects, inspect their details, and locate them on the map.
- **Game mechanics:** object activation and battle outcomes, including changes in health and experience points.
- **Player profiles:** view player information and profile-related features.
- **Leaderboard:** inspect the player ranking.
- **Persistent session:** use local storage to retain session and user information between launches.
- **Remote integration:** communicate with the game's REST API for users, nearby objects, object activation, and rankings.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Mobile application | React Native, JavaScript, Expo |
| Mapping and positioning | `react-native-maps`, `expo-location`, `geolib` |
| Local persistence | AsyncStorage, Expo SQLite |
| Media and interface | Expo Image Picker, custom image assets |
| Networking | Fetch API, JSON REST endpoints |

## Project Structure

```text
MostriDaTascaReact-main/
├── App.js                  # Entry point and main navigation state
├── app.json                # Expo configuration
├── babel.config.js         # Babel setup
├── assets/                 # Game icons, images and markers
└── components/             # Screens, UI elements and view-model logic
    ├── Mappa.jsx
    ├── Scanner.jsx
    ├── Profilo.jsx
    ├── Classifica.jsx
    ├── RisultatoBattaglia.jsx
    ├── CommunicationController.jsx
    └── ...
```

## Application Flow

1. The app loads or creates the player's session.
2. Location permissions enable exploration through the map interface.
3. Game data is requested from the remote service.
4. The player interacts with objects, visits profile screens, and views rankings.
5. Local persistence helps maintain the player session.

## Running the Project

This repository contains the Expo application source and assets. **The supplied archive does not include `package.json` or a lockfile**, so the dependency versions and installation commands cannot be reproduced directly from this snapshot.

To run the app, restore the original package manifest (or create a compatible Expo project and migrate these source files), install the imports listed in the source, and launch the project through Expo on an appropriate device or emulator. Location access is required for map features.

> **Service dependency:** Gameplay relies on an external educational API configured in `components/CommunicationController.jsx`. Availability and access to that service are not guaranteed.

## Notes

- The project is a learning-oriented mobile game, not a finished commercial release.
- Some interactions require the network, location permissions, and an operational backend.
- Before releasing publicly, verify the platform configuration and API availability.

## Author

**Biagio Chiarandà**

## License

No license file was included in the supplied snapshot. Add an explicit license if you intend to grant reuse rights.
