export enum Query {
  FIND_ALL_SHIPS = 'SELECT * FROM ship',
  FIND_ALL_SHIPS_GROUP_BY_TYPE =
  'SELECT type, count(*) FROM ship GROUP BY type',
  FIND_SHIP = 'SELECT ship.*, ARRAY_AGG(role.name) as roles FROM ship INNER JOIN ship_role ON ship.id = ship_role.ship_id INNER JOIN role ON ship_role.role_id = role.id WHERE ship.id = $1 GROUP BY ship.id ORDER BY ship.name',
  FIND_BY_DYNAMIC_QUERY =
  'SELECT ship.*, array_agg(role.name) as roles FROM ship INNER JOIN ship_role ON ship.id = ship_role.ship_id INNER JOIN role ON ship_role.role_id = role.id WHERE %F GROUP BY ship.id ORDER BY ship.name %P',
  INSERT_ROLES = 'INSERT INTO role (name) VALUES %L returning id, name',
  INSERT_SHIPS = 'INSERT INTO ship (id, name, type, year_built, active) VALUES %L',
  INSERT_SHIP_ROLES = 'INSERT INTO ship_role (ship_id, role_id) VALUES %L'
}
