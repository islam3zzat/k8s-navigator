import React, { useCallback } from "react";
import { V1EndpointsList } from "@kubernetes/client-node";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
  selector: Record<string, string>;
};
export const EndpointsList = ({ namespace, selector }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace || !selector) return [];

    const endpoints: V1EndpointsList = await window.k8sNavigator.listEndpoints(
      namespace,
      selector,
    );

    return endpoints.items;
  }, [selector, namespace]);

  return (
    <ResourceTable
      id={`endpoints-list-${JSON.stringify(selector)}`}
      title="Endpoints list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No endpoints found matching criteria"
      getId={(p) => p.metadata.uid}
      columns={columns}
    />
  );
};
