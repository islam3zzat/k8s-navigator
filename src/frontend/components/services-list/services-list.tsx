import { useCallback } from "react";
import { V1Secret } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const ServicesList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const service = await window.k8sNavigator.listServices(namespace);

    return service.items;
  }, [namespace]);
  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`services-list-${namespace}`}
      title="Service list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No services found"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(sa: V1Secret) => {
        navigate(`/services/${sa.metadata.name}`);
      }}
    />
  );
};
