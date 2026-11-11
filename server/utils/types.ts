export type ColumnType = "number" | "text";

export interface ColumnMeta {
  key: string;
  type: ColumnType;
}

export type Row = Record<string, string | number | null>;

export interface Dataset {
  columns: ColumnMeta[];
  rows: Row[];
  labelColumn: string;
  metricColumn: string | null;
}