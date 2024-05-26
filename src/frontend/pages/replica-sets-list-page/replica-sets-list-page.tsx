import { ReplicaSetsList } from "../../components";
import ReplicaSet from "../../icons/resources/unlabeled/sa.svg";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

export const ReplicaSetsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Replica Sets"
      routeOptions={{
        label: "Replica Sets",
        path: "/replica-sets",
        iconName: "ReplicaSet",
        icon: ReplicaSet,
      }}
    >
      <ReplicaSetsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};
