import { join } from 'path';
import * as pkgUp from 'pkg-up';

export const SERVER_PKG_JSON_PATH = pkgUp.sync();
if (!SERVER_PKG_JSON_PATH)
  throw new Error('package.json path could not be found');
export const ROOT_PKG_JSON_PATH = join(
  SERVER_PKG_JSON_PATH,
  '..',
  '..'
);

function rootBasedPath(name: string): string {
  return join(ROOT_PKG_JSON_PATH, name);
}

export class AppConstants {
  public static readonly GRAPHQL_SCHEMA_PATH = rootBasedPath('schema.graphql');

  public static readonly IS_USER_LOGGED = 'isUserLogged';
};