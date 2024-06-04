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

type Theme = "light" | "dark" | "purple-night" | "high-contrast";
export type State = {
  theme: Theme;
  watchIntervalsSeconds: number;
  activeContext: K8sContext | null;
  breadCrumbs: BreadCrumb[];
  contexts: K8sContext[];
  portForwards: PortForward[];
  activeNamespace: string;
  deployment: string;
  pod: string;
  isFindInPageOpen?: boolean;
};

let storedTheme: Theme = "purple-night";
let storedWatchIntervalSeconds = 5;
try {
  storedTheme = localStorage.getItem("theme") as Theme;
  storedWatchIntervalSeconds = parseFloat(
    localStorage.getItem("watchIntervalSeconds") || "5",
  );
} catch (e) {
  console.error("Error loading theme from local storage", e);
}

const initialState: State = {
  theme: storedTheme || "purple-night",
  watchIntervalsSeconds: storedWatchIntervalSeconds,
  activeContext: null,
  isFindInPageOpen: false,
  breadCrumbs: initBreadCrumbs,
  contexts: [],
  portForwards: [],
  activeNamespace: "",
  deployment: "",
  pod: "",
};

type SetWatchIntervalAction = {
  type: "SET_WATCH_INTERVAL";
  watchIntervalsSeconds: number;
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
  | ResetThemeAction
  | SetWatchIntervalAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_WATCH_INTERVAL":
      return {
        ...state,
        watchIntervalsSeconds: action.watchIntervalsSeconds,
      };
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
        portForwards: filterOutPortForward(
          state.portForwards,
          action.portForward,
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

function filterOutPortForward(
  portForwards: PortForward[],
  portForward: PortForward,
) {
  const match = portForwards.findIndex(
    (pf) =>
      pf.name === portForward.name &&
      pf.namespace === portForward.namespace &&
      pf.targetPort === portForward.targetPort &&
      pf.userPort === portForward.userPort,
  );

  if (match === -1) {
    return portForwards;
  }

  return portForwards.filter((_, index) => index !== match);
}
