import { ResourceListPage } from "../../layout";
import { ServiceAccountsList } from "../../components";
import { useAppContext } from "../../app-context";

const ServiceAccountsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Service Accounts"
      routeOptions={{
        label: "Service Accounts",
        path: "/service-accounts",
        iconName: "ServiceAccount",
      }}
    >
      <ServiceAccountsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};

export default ServiceAccountsListPage;
