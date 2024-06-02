type Primitive = string | number | boolean | null | undefined | symbol | bigint;

// Recursive utility type to make all properties writable
export type DeepWritable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? DeepWritableArray<U>
    : T extends ReadonlyArray<infer U>
      ? DeepWritableArray<U>
      : T extends object
        ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
        : T;

// Helper type to handle arrays specifically
export type DeepWritableArray<T> = Array<DeepWritable<T>>;
