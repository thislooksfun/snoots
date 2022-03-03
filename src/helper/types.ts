/** A string-keyed object that can hold anything. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>;

/**
 * Either a type or a promise that resolves to that type.
 *
 * @template T The resolved value type.
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * A function that either returns a type or a promise of that type.
 *
 * @template T The input type.
 * @template R The return type.
 * @param t Some input value.
 * @returns An Awaitable value.
 */
export type AwaitableFunction<T, R> = (t: T) => Awaitable<R>;

/**
 * A value that may or may not be `undefined`.
 *
 * @template T The type to be made optional.
 */
export type Maybe<T> = T | undefined;
