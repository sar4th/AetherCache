//comapair the types
export function compareTypes(value: any, schema: any) {
  let error: any = [];
  Object.keys(value).map((key: any) => {
    if (Object.keys(value).every((key) => schema.hasOwnProperty(key))) {
      if (typeof value[key] !== schema[key]) {
        const errorMessage = `Type of '${key}' (${typeof value[
          key
        ]}) is different from the schema (${schema[key]})`;
        error.push(errorMessage);
      }
    }
  });
  return error;
}
