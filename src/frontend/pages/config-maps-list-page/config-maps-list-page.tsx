import { lazy, Suspense } from "react";
import { ResourceListPage } from "../../layout";
import { useAppContext } from "../../app-context";
import PageLoadingFallback from "../../components/page-loading-fallback";
// Utility function to introduce a delay

// Lazy load the config-maps-list component with a delay
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
      <Suspense fallback={<PageLoadingFallback />}>
        <ConfigMapsList namespace={state.activeNamespace} />
      </Suspense>
    </ResourceListPage>
  );
};

export default ConfigMapsListPage;
