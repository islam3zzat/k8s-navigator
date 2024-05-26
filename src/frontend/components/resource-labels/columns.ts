import { Column } from "../data-table";

type ColumnType = {
  name: string;
  value: string;
};
export const columns: Column<ColumnType>[] = [
  {
    name: "Name",
    getData: (e: ColumnType) => e.name,
    compare(a, b) {
      return a.name.localeCompare(b.name);
    },
    width: "40%",
  },
  {
    name: "Value",
    getData: (e: ColumnType) => e.value || "",
    compare(a, b) {
      return a.name.localeCompare(b.value || "");
    },
  },
];
