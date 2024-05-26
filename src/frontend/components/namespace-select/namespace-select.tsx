import { useQuery } from "react-query";
import React, { useCallback } from "react";
import { V1NamespaceList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../app-context";
import { SettingsSelect } from "../settings-select";

export const NamespaceSelect = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const dataFetcher = useCallback(async () => {
    if (!state.activeContext) return [];

    try {
      const namespaces: V1NamespaceList =
        await window.k8sNavigator.listNamespaces();

      return namespaces.items.map((ns) => ns.metadata.name);
    } catch (error) {
      alert(
        "Error fetching namespaces. Falling back to default context namespace.",
      );
      return [state.activeContext?.namespace || "default"];
    }
  }, [state.activeContext]);

  const { data: namespaces, isLoading } = useQuery({
    queryKey: ["namespaces", { contextName: state.activeContext?.name }],
    queryFn: dataFetcher,
    staleTime: Infinity,
    retry: false,
  });

  const handleChange = (nextNamespace: string) => {
    dispatch({ type: "SET_ACTIVE_NAMESPACE", namespace: nextNamespace });
    navigate("/");
  };

  return (
    <SettingsSelect
      value={state.activeNamespace}
      isLoading={isLoading}
      onChange={handleChange}
      options={namespaces}
    />
  );
};
