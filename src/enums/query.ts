export enum Query {
  FIND_ALL_SHIPS = 'SELECT * FROM ship',
  FIND_ALL_SHIPS_GROUP_BY_TYPE =
  'SELECT type, count(*) FROM ship GROUP BY type',
  FIND_SHIP = 'SELECT ship.*, ARRAY_AGG(role.name) as roles FROM ship INNER JOIN ship_role ON ship.id = ship_role.ship_id INNER JOIN role ON ship_role.role_id = role.id WHERE ship.id = $1 GROUP BY ship.id ORDER BY ship.name'
}
