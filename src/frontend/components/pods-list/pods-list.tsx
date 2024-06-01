import React, { useCallback } from "react";
import { V1Pod } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
  title?: string;
  deploymentName?: string;
  selector?: Record<string, string>;
};
export const PodsList = ({
  namespace,
  deploymentName,
  selector,
  title = "Pods list",
}: Props) => {
  const navigate = useNavigate();
  const datFetcher = useCallback(async () => {
    if (!namespace) return [];

    if (selector) {
      const pods = await window.k8sNavigator.queryPodsBySelector(
        namespace,
        selector,
      );

      return pods.items;
    }

    if (deploymentName) {
      const pods = await window.k8sNavigator.listDeploymentPods(
        namespace,
        deploymentName,
      );

      return pods.items;
    }

    const pods = await window.k8sNavigator.listPods(namespace);

    return pods.items;
  }, [deploymentName, namespace, selector]);

  const handleRowClick = useCallback(
    (p: V1Pod) => {
      navigate(`/pods/${p.metadata.name}`);
    },
    [navigate],
  );

  return (
    <ResourceTable
      id={`pods-list-${deploymentName}-${JSON.stringify(selector)}`}
      title={title}
      dataFetcher={datFetcher}
      noResourcesMessage="No pods found matching criteria"
      getId={(p) => p.metadata.uid}
      columns={columns}
      onRowClick={handleRowClick}
    />
  );
};
