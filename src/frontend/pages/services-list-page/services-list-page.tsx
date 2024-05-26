import { ServicesList } from "../../components";
import Service from "../../icons/resources/unlabeled/svc.svg";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

export const ServicesListPage = () => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Services"
      routeOptions={{
        label: "Services",
        path: "/services",
        iconName: "Service",
        icon: Service,
      }}
    >
      <ServicesList namespace={namespace} />
    </ResourceListPage>
  );
};
