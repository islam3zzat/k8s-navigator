import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { V1NamespaceList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../app-context";
import { SettingsSelect } from "../settings-select";
import Notification from "../error-boundry/notification";

export const NamespaceSelect = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    severity: "error" as "error" | "info" | "success" | "warning",
  });

  const dataFetcher = useCallback(async () => {
    if (!state.activeContext) return [];

    try {
      const namespaces: V1NamespaceList =
        await window.k8sNavigator.listNamespaces();

      return namespaces.items.map((ns) => ns.metadata.name);
    } catch (error) {
      throw new Error(
        `Failed to fetch namespaces. Please check your access to the cluster: ${state.activeContext.cluster}.`,
      );
    }
  }, [state.activeContext]);

  const { data: namespaces, isLoading } = useQuery({
    queryKey: ["namespaces", { contextName: state.activeContext?.name }],
    queryFn: dataFetcher,
    staleTime: Infinity,
    retry(failureCount) {
      return failureCount < 3;
    },
    onError: (error: Error) => {
      setNotification({
        isOpen: true,
        message: error.message,
        severity: "error",
      });
    },
  });

  const handleChange = (nextNamespace: string) => {
    dispatch({ type: "SET_ACTIVE_NAMESPACE", namespace: nextNamespace });
    navigate("/");
  };

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <SettingsSelect
        name="Namespace"
        value={state.activeNamespace}
        isLoading={isLoading}
        onChange={handleChange}
        options={namespaces || []}
      />
      <Notification
        isOpen={notification.isOpen}
        handleClose={handleNotificationClose}
        message={notification.message}
        severity={notification.severity}
      />
    </>
  );
};
