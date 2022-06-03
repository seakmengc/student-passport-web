export function getArrByField(arr, field, defaultVal = '-') {
  const fields = field.split('.');
  if (fields.length === 0) {
    return defaultVal;
  }

  let val = arr[fields[0]];
  if (!val) {
    return defaultVal;
  }

  for (let index = 1; index < fields.length; index++) {
    if (!(val[fields[index]] ?? null)) {
      return defaultVal;
    }

    val = val[fields[index]];
  }

  return val;
}
