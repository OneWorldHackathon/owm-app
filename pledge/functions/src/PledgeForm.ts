export type Location = {
  lat: number, lng: number, countryCode: string, description: string,
}
export type PledgeForm = {

  readonly userId: string,
  readonly firstName: string,
  readonly lastName: string
  readonly yearOfBirth: string,
  readonly place: string
  readonly pledge: number,
  readonly location: Location,

}
