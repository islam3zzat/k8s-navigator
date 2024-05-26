import { useParams } from "react-router-dom";
import { ReplicaSetGeneralTab } from "./replica-set-general-tab";
import ReplicaSet from "../../icons/resources/unlabeled/rs.svg";

import { ResourceDetailsPage } from "../../layout/resource-details-page";

export const ReplicaSetDetailsPage = () => {
  const { replicaSetName } = useParams<{ replicaSetName: string }>();

  return (
    <ResourceDetailsPage
      name={replicaSetName}
      resourceKind="replicaSet"
      tabs={[
        {
          label: "General",
          slot: ReplicaSetGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/replica-sets/" + replicaSetName,
        label: "ReplicaSet Details",
        iconName: "ReplicaSet",
        icon: ReplicaSet,
      }}
    />
  );
};
