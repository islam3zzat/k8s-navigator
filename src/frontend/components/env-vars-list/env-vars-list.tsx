import { V1EnvVar } from "@kubernetes/client-node";
import { columns } from "./columns";
import { DataTable } from "../data-table";

type Props = {
  envs: V1EnvVar[];
};
export const EnvVarsList = ({ envs }: Props) => {
  return (
    <DataTable
      title="Environment variables"
      description="List of environment variables"
      noResourcesMessage="No environment variables found"
      columns={columns}
      data={envs}
      getId={(e) => e.name}
    />
  );
};
