import { useCallback } from "react";
import {
  V1ServiceAccount,
  V1ServiceAccountList,
} from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const ServiceAccountsList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const serviceAccounts: V1ServiceAccountList =
      await window.k8sNavigator.listServiceAccounts(namespace);

    return serviceAccounts.items;
  }, [namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`sercice-accounts-list`}
      title="Service accounts list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No serviceAccounts found"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(sa: V1ServiceAccount) => {
        navigate(`/service-accounts/${sa.metadata.name}`);
      }}
    />
  );
};
