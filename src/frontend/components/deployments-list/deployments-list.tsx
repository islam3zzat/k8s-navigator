import React, { useCallback } from "react";
import { V1Deployment, V1DeploymentList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const DeploymentsList = ({ namespace }: Props) => {
  const navigate = useNavigate();
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const deployments: V1DeploymentList =
      await window.k8sNavigator.listDeployments(namespace);

    return deployments.items;
  }, [namespace]);

  return (
    <ResourceTable
      id={`deployments-list`}
      title="Deployments list"
      dataFetcher={dataFetcher}
      getId={(d) => d.metadata.uid}
      columns={columns}
      onRowClick={(d: V1Deployment) => {
        navigate(`/deployments/${d.metadata.name}`);
      }}
    />
  );
};
