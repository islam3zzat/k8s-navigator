import { ReplicaSetsList } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

const ReplicaSetsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Replica Sets"
      routeOptions={{
        label: "Replica Sets",
        path: "/replica-sets",
        iconName: "ReplicaSet",
      }}
    >
      <ReplicaSetsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};

export default ReplicaSetsListPage;
