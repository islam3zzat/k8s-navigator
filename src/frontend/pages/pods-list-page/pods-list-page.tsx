import { ResourceListPage } from "../../layout";
import { PodsList } from "../../components";
import Pod from "../../icons/resources/unlabeled/pod.svg";
import { useAppContext } from "../../app-context";

export const PodsListPage = () => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Pods"
      routeOptions={{
        label: "Pods",
        path: "/pods",
        iconName: "Pod",
        icon: Pod,
      }}
    >
      <PodsList namespace={namespace} />
    </ResourceListPage>
  );
};
