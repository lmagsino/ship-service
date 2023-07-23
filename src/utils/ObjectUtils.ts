export default class ObjectUtils {
  static isNotNull(value: any) {
    const isNotNull = value !== null;
    const isNotUndefined = value !== undefined;
    const isNotEmpty = value !== '';
    return isNotNull && isNotUndefined && isNotEmpty;
  }

  static isNull(value: any) {
    const isNull = value === null;
    const isUndefined = value === undefined;
    const isEmpty = value === '';
    return isNull || isUndefined || isEmpty;
  }
}
