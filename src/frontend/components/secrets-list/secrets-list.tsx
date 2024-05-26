import { useCallback } from "react";
import { V1Secret, V1SecretList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const SecretsList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const secrets: V1SecretList =
      await window.k8sNavigator.listSecrets(namespace);

    return secrets.items;
  }, [namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`secrets-list-${namespace}`}
      title="Secrets list"
      noResourcesMessage="No secrets found"
      dataFetcher={dataFetcher}
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(sa: V1Secret) => {
        navigate(`/secrets/${sa.metadata.name}`);
      }}
    />
  );
};
