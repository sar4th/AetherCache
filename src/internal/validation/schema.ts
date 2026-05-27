import { SchemaDefinition } from "../../types";
import { SchemaNotFoundError, ValidationError } from "../../errors";

export function validateRecord(
  collectionName: string,
  value: unknown,
  schema: SchemaDefinition | undefined
): void {
  if (!schema) {
    throw new SchemaNotFoundError(collectionName);
  }

  if (!isPlainObject(value)) {
    throw new ValidationError("Record value must be a plain object");
  }

  const record = value as Record<string, unknown>;
  const missingKeys = Object.keys(schema).filter((key) => !(key in record));

  if (missingKeys.length > 0) {
    throw new ValidationError(
      `Validation failed: missing required field(s): ${missingKeys.join(", ")}`
    );
  }

  const invalidTypes = Object.entries(schema)
    .filter(([key, expectedType]) => typeof record[key] !== expectedType)
    .map(
      ([key, expectedType]) =>
        `Field '${key}' expected ${expectedType}, received ${typeof record[key]}`
    );

  if (invalidTypes.length > 0) {
    throw new ValidationError(invalidTypes.join("; "));
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
