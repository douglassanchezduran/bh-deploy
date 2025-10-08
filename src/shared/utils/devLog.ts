export function devErrorLog(...args: unknown[]) {
  console.error(...args);
}

export function devWarningLog(...args: unknown[]) {
  console.warn(...args);
}

export function devSuccessLog(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

export function devInfoLog(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.info(...args);
  }
}
