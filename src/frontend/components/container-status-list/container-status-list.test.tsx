import { render, screen } from "@testing-library/react";
import { V1ContainerStatus } from "@kubernetes/client-node";
import ContainerStatusList from "./container-status-list";

const mockStatuses: V1ContainerStatus[] = [
  {
    name: "container1",
    state: { running: {} },
    ready: true,
    restartCount: 1,
    image: "",
    imageID: "",
    containerID: "",
    started: true,
  },
  {
    name: "container2",
    state: {
      terminated: { exitCode: 0, finishedAt: new Date("2021-01-01T00:00:00Z") },
    },
    ready: false,
    restartCount: 0,
    image: "",
    imageID: "",
    containerID: "",
    started: false,
  },
];

describe("ContainerStatusList", () => {
  const defaultProps = {
    statuses: mockStatuses,
  };

  const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return render(<ContainerStatusList {...mergedProps} />);
  };

  test("renders correctly with container statuses", async () => {
    renderComponent();
    const title = await screen.findByLabelText(/Containers statuses/i);
    const container1 = await screen.findByText("container1");
    const container2 = await screen.findByText("container2");
    expect(title).toBeInTheDocument();
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  test("displays no resources message when there are no statuses", () => {
    renderComponent({ statuses: [] });
    expect(
      screen.getByText("No container statuses found."),
    ).toBeInTheDocument();
  });
});
