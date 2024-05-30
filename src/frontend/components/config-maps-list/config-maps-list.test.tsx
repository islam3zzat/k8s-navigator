import { render, screen } from "@testing-library/react";
import { V1ConfigMapList } from "@kubernetes/client-node";
import ConfigMapsList from "./config-maps-list";
import TestWrapper from "../../../tests/TestWrapper";

window.k8sNavigator = {
  ...window.k8sNavigator,
  listConfigMaps: jest.fn(),
};

const mockConfigMaps: V1ConfigMapList = {
  items: [
    {
      metadata: {
        uid: "1",
        name: "config-map-1",
        namespace: "test-namespace",
      },
    },
    {
      metadata: {
        uid: "2",
        name: "config-map-2",
        namespace: "test-namespace",
      },
    },
  ],
};

beforeAll(() => {
  // Set up the mock implementation before running the tests
  (
    window.k8sNavigator.listConfigMaps as jest.MockedFunction<
      typeof window.k8sNavigator.listConfigMaps
    >
  ).mockImplementation(() => Promise.resolve(mockConfigMaps));
});

test("renders ConfigMapsList component", async () => {
  render(
    <TestWrapper>
      <ConfigMapsList namespace="test-namespace" />
    </TestWrapper>,
  );

  // Wait for the expected element to appear with a longer timeout
  const titleElement = await screen.findByText(/Config Maps list/i);
  expect(titleElement).toBeInTheDocument();
  expect(titleElement).toBeInTheDocument();

  // Check if the mock config map items are rendered
  const configMap1 = screen.getByText(/config-map-1/i);
  const configMap2 = screen.getByText(/config-map-2/i);
  expect(configMap1).toBeInTheDocument();
  expect(configMap2).toBeInTheDocument();
});
