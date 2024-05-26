import { Context as K8sContext } from "@kubernetes/client-node";
import React from "react";

export type PortForward = {
  namespace: string;
  name: string;
  targetPort: string;
  userPort: string;
};

type BreadCrumb = {
  label: string;
  path: string;
  iconName?: string;
};
const initBreadCrumbs: BreadCrumb[] = [
  {
    label: "Home",
    path: "/",
    iconName: "Home",
  },
];

type Theme = "light" | "dark";
type State = {
  theme: Theme;
  activeContext: K8sContext | null;
  breadCrumbs: BreadCrumb[];
  contexts: K8sContext[];
  portForwards: PortForward[];
  activeNamespace: string;
  deployment: string;
  pod: string;
  isFindInPageOpen?: boolean;
};

const initialState: State = {
  theme: "dark",
  activeContext: null,
  isFindInPageOpen: false,
  breadCrumbs: initBreadCrumbs,
  contexts: [],
  portForwards: [],
  activeNamespace: "",
  deployment: "",
  pod: "",
};

type SetThemeAction = {
  type: "SET_THEME";
  theme: Theme;
};
type ResetThemeAction = {
  type: "RESET_THEME";
};

type ShowFindInPageAction = {
  type: "SHOW_FIND_IN_PAGE";
};

type HideFindInPageAction = {
  type: "HIDE_FIND_IN_PAGE";
};

type SetBreadCrumbAction = {
  type: "SET_BREADCRUMB";
  breadCrumb: BreadCrumb[];
};

type PopBreadCrumbAction = {
  type: "POP_BREADCRUMB";
};

type SliceBreadCrumbsAction = {
  type: "SLICE_BREADCRUMB";
  index: number;
};

type ResetBreadCrumbsAction = {
  type: "RESET_BREADCRUMBS";
};

type SetPortForwardsAction = {
  type: "SET_PORT_FORWARDS";
  portForwards: PortForward[];
};

type AddPortForwardAction = {
  type: "ADD_PORT_FORWARD";
  portForward: PortForward;
};

type RemovePortForwardAction = {
  type: "REMOVE_PORT_FORWARD";
  portForward: PortForward;
};

type RemoveAllPortForwardsAction = {
  type: "REMOVE_ALL_PORT_FORWARDS";
};

type SetActiveContextAction = {
  type: "SET_ACTIVE_CONTEXT";
  context: K8sContext;
};

type SetActiveNamespaceAction = {
  type: "SET_ACTIVE_NAMESPACE";
  namespace: string;
};

type SetDeploymentAction = {
  type: "SET_DEPLOYMENT";
  deployment: string;
};

type SetPodAction = {
  type: "SET_POD";
  pod: string;
};

type Action =
  | SetActiveContextAction
  | SetActiveNamespaceAction
  | SetDeploymentAction
  | SetPodAction
  | SetPortForwardsAction
  | AddPortForwardAction
  | RemovePortForwardAction
  | RemoveAllPortForwardsAction
  | SetBreadCrumbAction
  | PopBreadCrumbAction
  | SliceBreadCrumbsAction
  | ResetBreadCrumbsAction
  | ShowFindInPageAction
  | HideFindInPageAction
  | SetThemeAction
  | ResetThemeAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        theme: action.theme,
      };
    case "RESET_THEME":
      return {
        ...state,
        theme: "light",
      };
    case "SHOW_FIND_IN_PAGE":
      return {
        ...state,
        isFindInPageOpen: true,
      };
    case "HIDE_FIND_IN_PAGE":
      return {
        ...state,
        isFindInPageOpen: false,
      };
    case "SET_BREADCRUMB":
      return {
        ...state,
        breadCrumbs: action.breadCrumb,
      };
    case "POP_BREADCRUMB":
      return {
        ...state,
        breadCrumbs:
          state.breadCrumbs.length > 1
            ? state.breadCrumbs.slice(0, -1)
            : state.breadCrumbs,
      };
    case "SLICE_BREADCRUMB":
      return {
        ...state,
        breadCrumbs: state.breadCrumbs.slice(0, action.index),
      };
    case "RESET_BREADCRUMBS":
      return {
        ...state,
        breadCrumbs: initBreadCrumbs,
      };
    case "SET_ACTIVE_CONTEXT":
      return {
        ...state,
        activeContext: action.context,
        activeNamespace: action.context?.namespace || "default",
      };
    case "SET_PORT_FORWARDS":
      return {
        ...state,
        portForwards: action.portForwards,
      };
    case "ADD_PORT_FORWARD":
      return {
        ...state,
        portForwards: [...state.portForwards, action.portForward],
      };
    case "REMOVE_PORT_FORWARD":
      return {
        ...state,
        portForwards: state.portForwards.filter(
          (pf) =>
            (pf.name !== action.portForward.name &&
              pf.namespace !== action.portForward.namespace &&
              pf.targetPort !== action.portForward.targetPort &&
              pf.userPort !== action.portForward.userPort) ||
            action.portForward.targetPort,
        ),
      };
    case "REMOVE_ALL_PORT_FORWARDS":
      return {
        ...state,
        portForwards: [],
      };
    case "SET_ACTIVE_NAMESPACE":
      return {
        ...state,
        activeNamespace: action.namespace,
      };
    case "SET_DEPLOYMENT":
      return {
        ...state,
        deployment: action.deployment,
      };

    case "SET_POD":
      return {
        ...state,
        pod: action.pod,
      };

    default:
      return state;
  }
};

const AppContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {
    // do nothing
  },
});

export const useAppContext = () => React.useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
