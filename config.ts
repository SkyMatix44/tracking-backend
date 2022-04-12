// App Confiig
export const config: Configuration = {
  database: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null,
    database: 'tracking_app',
    // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data. https://docs.nestjs.com/techniques/database
    synchronize: true,
  },
};

/**
 * Global App Configuration
 */
export interface Configuration {
  // Database Config
  database: DatabaseConfiguration;
}

/**
 * Database Configuration
 * @see https://docs.nestjs.com/techniques/database
 */
export interface DatabaseConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}
