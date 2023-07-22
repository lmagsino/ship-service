export default class ObjectUtils {
  static isNotNull(value: any) {
    const isNotNull = value !== null;
    const isNotUndefined = value !== undefined;
    return isNotNull && isNotUndefined;
  }

  static isNull(value: any) {
    const isNull = value === null;
    const isUndefined = value === undefined;
    return isNull || isUndefined;
  }
}
