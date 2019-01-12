import { Timestamp, DocumentData } from '@google-cloud/firestore'

export type FirestoreValue =
  | null
  | string
  | number
  | boolean
  | DocumentData
  | FirestoreArray
  | Timestamp

export interface FirestoreArray extends Array<FirestoreValue> { }

export const UNDEFINED_STRING = '******$$$$$$$$$_____UNDEFINED_____$$$$$$$********'
export const toFirestore = (v: object): DocumentData => {
  return parseFirestoreValue(v) as DocumentData
}

export const parseFirestoreValue = (v: any): FirestoreValue => {
  if (v === null) return null
  switch (typeof v) {
    case 'undefined': return UNDEFINED_STRING
    case 'boolean': return v
    case 'number': return v
    case 'string': return v
    case 'symbol': return v.toString()
    case 'object':
      // Handle Dates\
      if (v instanceof Date) {
        return Timestamp.fromDate(v)
      }
      // Handle firestore native Timestamp
      if (v instanceof Timestamp) {
        return v
      }
      // map over arrays
      if (Array.isArray(v)) return filterUndef(v.map(toFirestore))

      // process a Set into an Array.
      if (v instanceof Set) {
        return filterUndef(Array.from(v.values()).map(toFirestore))
      }

      const res: { [_: string]: FirestoreValue } = {}
      Object.keys(v).forEach((k: string) => {
        const j = parseFirestoreValue(v[k])
        // ignore any undefined values
        if (j !== undefined && j !== UNDEFINED_STRING) res[k] = j
      })

      return res
    default: return null
  }

  function filterUndef<T>(ts: (T | undefined)[]): T[] {
    return ts.filter((t: T | undefined): t is T => !!t)
  }
}
