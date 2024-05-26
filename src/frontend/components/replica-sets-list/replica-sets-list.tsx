import React, { useCallback } from "react";
import { V1ReplicaSet, V1ReplicaSetList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const ReplicaSetsList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const replicaSets: V1ReplicaSetList =
      await window.k8sNavigator.listReplicaSets(namespace);

    return replicaSets.items;
  }, [namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`sercice-accounts-list`}
      title="Replic sets list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No replicaSets found"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(rs: V1ReplicaSet) => {
        navigate(`/replica-sets/${rs.metadata.name}`);
      }}
    />
  );
};
