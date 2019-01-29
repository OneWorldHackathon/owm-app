export type Location = {
  lat: number, lng: number, countryCode: string, description: string,
}
export type PledgeForm = {

  readonly userId: string,
  readonly userDisplayName: string
  readonly yearOfBirth: string,
  readonly pledge: number,
  readonly location: Location,
  response?: string | { error: { msg: string, code?: number } },

}
