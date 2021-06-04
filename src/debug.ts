import { inspect as insp } from 'util'

export function inspect(obj: any, depth: number): string { return insp(obj, { colors: true, depth: depth }) }

export default function debug(obj: any, depth: number = 10): void {
    console.debug(inspect(obj, depth))
}
