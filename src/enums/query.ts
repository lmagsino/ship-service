export enum Query {
  FIND_ALL = 'SELECT * FROM ship',
  FIND_ALL_GROUP_BY_TYPE = 'SELECT type, count(*) FROM ship GROUP BY type'
}
