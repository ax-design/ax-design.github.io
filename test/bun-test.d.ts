// The site has no bun-types dependency; this declares the part of bun:test the suite uses.
declare module 'bun:test' {
    export function test(name: string, fn: () => void | Promise<void>): void;
    export function expect(value: unknown): {
        toBe(expected: unknown): void;
        toEqual(expected: unknown): void;
    };
}
