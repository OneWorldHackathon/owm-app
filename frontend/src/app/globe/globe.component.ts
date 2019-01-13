import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css'],
})
export class GlobeComponent implements OnInit {

  constructor(
  ) {
  }

  async ngOnInit(): Promise<void> {
    const container: HTMLElement | null = document.getElementById('globeContainer')

    if (window['DAT'] && window['DAT']['Globe']) {

      const datGlobe = window['DAT']['Globe']

      const data =
        [6, 159, 0.001, 30, 99, 0.002, 45, -109, 0.000, 42, 115, 0.007, 4, -54, 0.000,
          -16, -67, 0.014, 21, -103, 0.006, -20, -64, 0.004, -40, -69, 0.001,
          32, 64, 0.001, 28, 67, 0.006, 8, 22, 0.000, -15, 133, 0.000, -16, 20, 0.000,
          55, 42, 0.006, 32, -81, 0.010, 31, 36, 0.067, 9, 80, 0.016, 42, -91, 0.006,
          19, 54, 0.001, 21, 111, 0.163, -3, -51, 0.001, 33, 119, 0.150, 65, 21, 0.002,
          46, 49, 0.015, 43, 77, 0.043, 45, 130, 0.018, 4, 119, 0.006, 22, 59, 0.002,
          9, -82, 0.003, 46, -60, 0.002, -14, 15, 0.006, -15, -76, 0.001, 57, 15, 0.007,
          52, 9, 0.056, 10, 120, 0.004, 24, 87, 0.134, 0, -51, 0.005, -5, 123, 0.013,
        ]

      const globe = datGlobe(container, { imgDir: '/assets/globe/' })

      globe.addData(
        data,
        {
          format: 'magnitude',
          name: 'pledges',
        },
      )

      globe.createPoints()

      globe.animate()

    }
  }
}

const isArray = Array.isArray || function (xs: any): boolean {
  return Object.prototype.toString.call(xs) === '[object Array]'
}

export function concatMap<I, O>(xs: I[], fn: (element: I, index?: number) => O | O[]): O[] {
  const res: O[] = []
  for (let i = 0; i < xs.length; i = i + 1) {
    const x: O | O[] = fn(xs[i], i)
    if (isArray(x)) res.push.apply(res, x)
    else res.push(x)
  }
  return res
}
