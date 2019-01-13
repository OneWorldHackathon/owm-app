import { Component, OnInit } from '@angular/core'
import { PledgeService } from '@shared/services/pledge.service'
import { Color } from 'three'

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css'],
})
export class GlobeComponent implements OnInit {

  constructor(
    readonly pledgeService: PledgeService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const container: HTMLElement | null = document.getElementById('globeContainer')

    if (window['DAT'] && window['DAT']['Globe']) {

      const datGlobe = window['DAT']['Globe']

      this.pledgeService.getGlobeData().subscribe(
        (data: number[]) => {

          const globe = datGlobe(container, {
            imgDir: '/assets/globe/',
            backgroundColor: 0x008000,
            colorFn: (x: number) => new Color(1.0, 1.0, x * 4),
          })

          globe.addData(
            data,
            {
              format: 'magnitude',
              name: 'pledges',
            },
          )

          globe.createPoints()

          globe.animate()

        },
      )
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
