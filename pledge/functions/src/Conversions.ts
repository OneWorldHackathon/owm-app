
export class Conversions {

  static readonly MILES_METRES_CONSTANT: number = 1609.344
  static readonly MILES_KILOMETRES_CONSTANT: number = 1.60934
  static readonly METRES_KILOMETRES_CONSTANT: number = 1000

  static metresToKilometres(metres: number): number {
    return metres / this.METRES_KILOMETRES_CONSTANT
  }
  static metresToMiles(metres: number) : number {
    return metres / this.MILES_METRES_CONSTANT
  }
  static milesToMetres(miles: number): number {
    return miles * this.MILES_METRES_CONSTANT
  }
}
