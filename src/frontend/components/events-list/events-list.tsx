import React, { useCallback } from "react";
import { CoreV1EventList } from "@kubernetes/client-node";
import { columns } from "./columns";
import { useAppContext } from "../../app-context";
import { ResourceTable } from "../resource-table";

type Props = {
  name?: string;
};
export const EventsList = ({ name }: Props) => {
  const { state } = useAppContext();
  const dataFetcher = useCallback(async () => {
    if (!state.activeNamespace) return [];
    if (name) {
      const events: CoreV1EventList = await window.k8sNavigator.listEvents(
        state.activeNamespace,
        name,
      );
      console.log(events.items);

      return events.items;
    }

    const events: CoreV1EventList = await window.k8sNavigator.listEvents(
      state.activeNamespace,
    );

    return events.items;
  }, [state.activeNamespace, name]);

  return (
    <ResourceTable
      id={`events-list-${name}-${state.activeNamespace}`}
      title="Events list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No events found matching criteria"
      getId={(d) => d.metadata.uid}
      columns={columns}
    />
  );
};
