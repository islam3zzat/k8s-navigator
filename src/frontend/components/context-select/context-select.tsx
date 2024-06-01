import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAppContext } from "../../app-context";
import { SettingsSelect } from "../settings-select";

export const ContextSelect = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const currentContext = state.activeContext?.name;

  function dataFetcher() {
    return window.k8sNavigator.listContexts().then((contexts) => {
      return contexts.map((context) => context.name);
    });
  }

  const { data: contexts, isLoading } = useQuery({
    queryKey: ["contexts"],
    queryFn: dataFetcher,
    staleTime: Infinity,
  });

  const setCurrentContext = useCallback(
    async (context: string) => {
      const nextContext = await window.k8sNavigator.switchContext(context);

      dispatch({ type: "SET_ACTIVE_CONTEXT", context: nextContext });

      if (nextContext?.namespace) {
        dispatch({
          type: "SET_ACTIVE_NAMESPACE",
          namespace: nextContext.namespace,
        });
      }

      navigate("/");
    },
    [dispatch, navigate],
  );

  return (
    <SettingsSelect
      name="Context"
      value={currentContext || contexts?.[0]}
      isLoading={isLoading}
      onChange={setCurrentContext}
      options={contexts}
    />
  );
};
