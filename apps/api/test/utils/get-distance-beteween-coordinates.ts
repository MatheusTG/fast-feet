type Coordinates = {
  latitude: number;
  longitude: number;
};

export function getDistanceBetweenCoordinates(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Raio médio da Terra em km

  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLatitude = toRadians(to.latitude - from.latitude);
  const dLongitude = toRadians(to.longitude - from.longitude);

  const latitude1 = toRadians(from.latitude);
  const latitude2 = toRadians(to.latitude);

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(dLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
