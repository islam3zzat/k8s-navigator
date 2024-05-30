import { lazy, Suspense } from "react";
import { ResourceListPage } from "../../layout";
import { useAppContext } from "../../app-context";
import LoadingFallback from "../../components/loading-fallback";

const ConfigMapsList = lazy(
  () =>
    import(
      /* webpackChunkName: "config-maps-list" */
      "../../components/config-maps-list"
    ),
);

const ConfigMapsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Config Maps"
      routeOptions={{
        label: "Config Maps",
        path: "/config-maps",
        iconName: "ConfigMap",
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ConfigMapsList namespace={state.activeNamespace} />
      </Suspense>
    </ResourceListPage>
  );
};

export default ConfigMapsListPage;
