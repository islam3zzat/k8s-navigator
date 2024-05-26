import { useCallback } from "react";
import { V1ConfigMap, V1ConfigMapList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const ConfigMapsList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const configMaps: V1ConfigMapList =
      await window.k8sNavigator.listConfigMaps(namespace);

    return configMaps.items;
  }, [namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`sercice-accounts-list-${namespace}`}
      title="Config Maps list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No configMaps found"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(sa: V1ConfigMap) => {
        navigate(`/config-maps/${sa.metadata.name}`);
      }}
    />
  );
};
