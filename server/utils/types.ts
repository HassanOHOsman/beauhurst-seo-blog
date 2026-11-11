export type ColumnType = "number" | "text";

export interface ColumnMeta {
  key: string;
  type: ColumnType;
}

export type Row = Record<string, string | number | null>;
