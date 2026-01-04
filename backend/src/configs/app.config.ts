const appConfig: IAppConfig = {
  /**
   * server port
   */
  PORT: 3001,

  /**
   * ngilangin properti sourceUrl di response
   *
   * jika true:
   *  {
   *    {...props}
   *    sourceUrl: "..."
   *  }
   *
   * jika false:
   *  {
   *    {...props}
   *  }
   */
  sourceUrl: true,
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_change_me",
};

export default appConfig;
