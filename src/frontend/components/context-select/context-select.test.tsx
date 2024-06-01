import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { axe } from "jest-axe";
import { ContextSelect } from "./context-select";
import { useAppContext } from "../../app-context";

// Mock the dependencies
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../app-context", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../settings-select", () => ({
  SettingsSelect: ({ value, isLoading, onChange, options }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
    >
      {options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

describe("ContextSelect", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockListContexts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppContext as jest.Mock).mockReturnValue({
      state: { activeContext: { name: "default" } },
      dispatch: mockDispatch,
    });
    window.k8sNavigator = {
      listContexts: mockListContexts,
      switchContext: jest.fn().mockResolvedValue({
        name: "default",
        namespace: "default-namespace",
      }),
    };
  });

  test("renders ContextSelect with loading state", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<ContextSelect />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  test("renders ContextSelect with data", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: ["context1", "context2"],
      isLoading: false,
    });

    render(<ContextSelect />);

    expect(screen.getByRole("combobox")).not.toBeDisabled();
    expect(
      screen.getByRole("option", { name: "context1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "context2" }),
    ).toBeInTheDocument();
  });

  test("handles context change", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: ["context1", "context2"],
      isLoading: false,
    });

    render(<ContextSelect />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "context2" },
    });

    await waitFor(() => {
      expect(window.k8sNavigator.switchContext).toHaveBeenCalledWith(
        "context2",
      );
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_ACTIVE_CONTEXT",
        context: { name: "default", namespace: "default-namespace" },
      });
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_ACTIVE_NAMESPACE",
        namespace: "default-namespace",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
