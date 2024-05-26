import { V1ContainerStatus } from "@kubernetes/client-node";
import { columns } from "./columns";
import { DataTable } from "../data-table";

type Props = {
  statuses: V1ContainerStatus[];
};
export const ContainerStatusList = ({ statuses }: Props) => {
  return (
    <DataTable
      title="Container statuses"
      description="List of container statuses"
      noResourcesMessage="No container statuses found."
      columns={columns}
      data={statuses}
      getId={(e) => e.name}
    />
  );
};
