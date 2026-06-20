/**
 * Database mapper: convertit les données Supabase (snake_case) ↔ Angular models (camelCase)
 */

/** snake_case → camelCase */
export function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = toCamelCase(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[camelKey] = (value as unknown[]).map(item =>
        typeof item === 'object' && item !== null ? toCamelCase(item as Record<string, unknown>) : item
      );
    } else {
      result[camelKey] = value;
    }
  }
  return result as T;
}

/** camelCase → snake_case (pour les inserts/updates) */
export function toSnakeCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = toSnakeCase(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[snakeKey] = (value as unknown[]).map(item =>
        typeof item === 'object' && item !== null ? toSnakeCase(item as Record<string, unknown>) : item
      );
    } else {
      result[snakeKey] = value;
    }
  }
  return result as T;
}

/** Transforme un tableau d'items de Supabase */
export function mapArray<T>(items: unknown[]): T[] {
  return items.map(item => toCamelCase<T>((item as Record<string, unknown>)));
}
