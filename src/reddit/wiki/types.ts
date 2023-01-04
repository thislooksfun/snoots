export interface WikiSettings {
  permlevel: number;
  listed: boolean;
}

export interface WikiSettingsAndEditors extends WikiSettings {
  editors: Array<string>;
}
