import { V1EnvVar } from "@kubernetes/client-node";
import { Column } from "../data-table";

function getEnvValueSource(env: V1EnvVar) {
  if (env.valueFrom?.fieldRef) {
    return "Field";
  } else if (env.valueFrom?.resourceFieldRef) {
    return "Resource";
  } else if (env.valueFrom?.configMapKeyRef) {
    return "ConfigMap";
  } else if (env.valueFrom?.secretKeyRef) {
    return "Secret";
  } else {
    return "";
  }
}
export const columns: Column<V1EnvVar>[] = [
  {
    name: "Name",
    getData: (e: V1EnvVar) => e.name,
    compare(a, b) {
      return a.name.localeCompare(b.name);
    },
    width: "40%",
  },
  {
    name: "Value",
    getData: (e: V1EnvVar) => e.value || "",
    compare(a, b) {
      return a.name.localeCompare(b.value || "");
    },
  },
  {
    name: "Type",
    getData: (e: V1EnvVar) => e.valueFrom?.fieldRef?.fieldPath || "",
    compare(a, b) {
      return a.name.localeCompare(b.valueFrom?.fieldRef?.fieldPath || "");
    },
  },
  {
    name: "Source",
    getData: (e: V1EnvVar) => {
      return getEnvValueSource(e);
    },
    compare(a, b) {
      return getEnvValueSource(a).localeCompare(getEnvValueSource(b));
    },
  },
];
