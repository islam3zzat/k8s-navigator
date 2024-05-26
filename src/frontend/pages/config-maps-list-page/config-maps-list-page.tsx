import { ResourceListPage } from "../../layout";
import { ConfigMapsList } from "../../components";
import ConfigMap from "../../icons/resources/unlabeled/cm.svg";
import { useAppContext } from "../../app-context";

export const ConfigMapsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Config Maps"
      routeOptions={{
        label: "Config Maps",
        path: "/config-maps",
        iconName: "ConfigMap",
        icon: ConfigMap,
      }}
    >
      <ConfigMapsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};
