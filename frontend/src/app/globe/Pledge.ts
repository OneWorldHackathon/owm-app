export type Location = {
  lat: number,
  lng: number,
  countryCode: string,
  description: string,
}

export type PledgeData = {
  readonly id: string,
  readonly userId: string,
  readonly distanceMetres: number,
  readonly location: Location,
}
