import deepmerge from 'deepmerge';
import {APP_VERSION_NUMBER} from '@/data';

export function cleanObject(
  source: Record<string, unknown>,
  template: Record<string, unknown>,
): Record<string, unknown> {
  const result = {...source};
  Object.keys(result).forEach(key => {
    if (!(key in template)) {
      delete result[key];
    } else if (
      typeof result[key] === 'object' &&
      result[key] !== null &&
      typeof template[key] === 'object' &&
      template[key] !== null
    ) {
      result[key] = cleanObject(
        result[key] as Record<string, unknown>,
        template[key] as Record<string, unknown>,
      );
    }
  });
  return result;
}

export function migrate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultState: Record<string, any>,
  persistedState: unknown,
  version: number,
): Record<string, unknown> {
  if (version === APP_VERSION_NUMBER) {
    return persistedState as Record<string, unknown>;
  }

  if (!persistedState || typeof persistedState !== 'object') {
    return defaultState;
  }

  const mergedState = deepmerge(
    defaultState,
    persistedState as Record<string, unknown>,
  );
  return cleanObject(mergedState, defaultState);
}
