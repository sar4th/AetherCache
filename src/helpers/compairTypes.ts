let obj2 = {
  name: "string",
  age: "string",
  email: "string",
};
let obj1 = {
  name: "sarath",
  age: 12,
  email: "s@mail",
};
export function compareTypes(value: any, schema: any) {
  let error: any = [];
  Object.keys(value).map((key: any) => {
    if (Object.keys(value).every((key) => schema.hasOwnProperty(key))) {
      if (typeof value[key] != typeof schema[key]) {
        const errorMessage = `Type of '${key}' (${typeof value[
          key
        ]}) is different from the schema (${typeof schema[key]})`;
        console.log(errorMessage);

        error.push({
          message: errorMessage,
        });
      }
    }
  });
  return error;
}
compareTypes(obj1, obj2);
