import { ResourceListPage } from "../../layout";
import { ServiceAccountsList } from "../../components";
import ServiceAccount from "../../icons/resources/unlabeled/sa.svg";
import { useAppContext } from "../../app-context";

export const ServiceAccountsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Service Accounts"
      routeOptions={{
        label: "Service Accounts",
        path: "/service-accounts",
        iconName: "ServiceAccount",
        icon: ServiceAccount,
      }}
    >
      <ServiceAccountsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};
