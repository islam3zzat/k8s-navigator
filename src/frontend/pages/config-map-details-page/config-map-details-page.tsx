import { useParams } from "react-router-dom";

import ConfigMapGeneralTab from "./config-map-general-tab";
import ConfigMap from "../../icons/resources/unlabeled/cm.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const ConfigMapDetailsPage = () => {
  const { configMapName } = useParams<{ configMapName: string }>();

  return (
    <ResourceDetailsPage
      name={configMapName}
      resourceKind="configMap"
      tabs={[
        {
          label: "General",
          slot: ConfigMapGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/configMaps/" + configMapName,
        label: "ConfigMap Details",
        iconName: "ConfigMap",
        icon: ConfigMap,
      }}
    />
  );
};
export default ConfigMapDetailsPage;
