import { SpecialQuery } from '../enums/special_query';
import ObjectUtils from './ObjectUtils';

export default class QueryUtils {
  static formatDynamicQuery(query: string, sqlQueryMapping: any[]) {
    let filterParams: string = '';
    let page: number = 0;
    let pageSize: number = 0;

    sqlQueryMapping.forEach((sqlQueryMap) => {
      if (ObjectUtils.isNotNull(filterParams) &&
      ObjectUtils.isNotNull(sqlQueryMap.sqlFieldName)) {
        filterParams += ' AND';
      }

      if (ObjectUtils.isNotNull(sqlQueryMap.special)) {
        switch (sqlQueryMap.special[0]) {
          case SpecialQuery.STARTS_WITH:
            filterParams +=
              this.createStartsWithQuery(
                sqlQueryMap.sqlFieldName, sqlQueryMap.queryValue
              );
            break;
          case SpecialQuery.GREATER_THAN_EQUAL:
            filterParams +=
              this.createGreaterThanEqualQuery(
                sqlQueryMap.sqlFieldName, sqlQueryMap.queryValue
              );
            break;
          case SpecialQuery.LESS_THAN_EQUAL:
            filterParams +=
              this.createLessThanEqualQuery(
                sqlQueryMap.sqlFieldName, sqlQueryMap.queryValue
              );
            break;
          case SpecialQuery.PAGE_SIZE:
            pageSize = Number(sqlQueryMap.queryValue);
            break;
          case SpecialQuery.PAGE:
            page = Number(sqlQueryMap.queryValue);
            break;
        }
      } else {
        filterParams +=
          this.createQuery(sqlQueryMap.sqlFieldName, sqlQueryMap.queryValue);
      }
    })

    const pageFilterParams: string =
      this.createPageFilterParams(pageSize, page);

    if (ObjectUtils.isNotNull(filterParams)) {
      filterParams = 'WHERE ' + filterParams;
    }

    return query.replace('%F', filterParams).replace('%P', pageFilterParams);
  }

  private static createPageFilterParams(pageSize: number, page: number) {
    let pageFilterParams: string = '';
    if (pageSize > 0) {
      pageFilterParams += ` LIMIT ${pageSize}`;

      if (page > 0) {
        pageFilterParams += ` OFFSET ${pageSize * (page - 1)} `;
      }
    }

    return pageFilterParams;
  }

  private static createStartsWithQuery(field: string, value: string) {
    return ` LOWER(${field}) LIKE LOWER('${value}%')`;
  }

  private static createGreaterThanEqualQuery(field: string, value: string) {
    return ` ${field} >= ${value}`;
  }

  private static createLessThanEqualQuery(field: string, value: string) {
    return ` ${field} <= ${value}`;
  }

  private static createQuery(field: string, value: string) {
    return ` LOWER(${field}) = LOWER('${value}')`;
  }
}
