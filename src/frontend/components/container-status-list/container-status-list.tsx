import { V1ContainerStatus } from "@kubernetes/client-node";
import { columns } from "./columns";
import { DataTable } from "../data-table";

type Props = {
  statuses: V1ContainerStatus[];
};
const ContainerStatusList = ({ statuses }: Props) => {
  return (
    <DataTable
      title="Containers statuses"
      noResourcesMessage="No container statuses found."
      columns={columns}
      data={statuses}
      getId={(s) => s.name}
    />
  );
};

export default ContainerStatusList;
