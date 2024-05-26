import { useParams } from "react-router-dom";
import ServiceAccountGeneralTab from "./service-account-general-tab";
import ServiceAccount from "../../icons/resources/unlabeled/sa.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const ServiceAccountDetailsPage = () => {
  const { serviceAccountName } = useParams<{ serviceAccountName: string }>();

  return (
    <ResourceDetailsPage
      name={serviceAccountName}
      resourceKind="serviceAccount"
      tabs={[
        {
          label: "General",
          slot: ServiceAccountGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/serviceAccounts/" + serviceAccountName,
        label: "ServiceAccount Details",
        iconName: "ServiceAccount",
        icon: ServiceAccount,
      }}
    />
  );
};

export default ServiceAccountDetailsPage;
