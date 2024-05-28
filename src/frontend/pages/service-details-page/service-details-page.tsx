import { useParams } from "react-router-dom";
import ServiceGeneralTab from "./service-general-tab";

import { ResourceDetailsPage } from "../../layout/resource-details-page";

const ServiceDetailsPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();

  return (
    <ResourceDetailsPage
      name={serviceName}
      resourceKind="service"
      tabs={[
        {
          label: "General",
          slot: ServiceGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/services/" + serviceName,
        label: "Service Details",
        iconName: "Service",
      }}
    />
  );
};

export default ServiceDetailsPage;
