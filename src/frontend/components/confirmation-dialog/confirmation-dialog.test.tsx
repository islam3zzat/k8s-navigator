import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ConfirmationDialog from "./confirmation-dialog";
import type { Props } from "./confirmation-dialog";

describe("ConfirmationDialog", () => {
  const defaultProps: Props = {
    isOpen: true,
    title: "Are you sure?",
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    children: <div>Dialog content</div>,
    primaryButtonText: "Confirm",
    primaryButtonColor: "primary",
    secondaryButtonText: "Cancel",
    secondaryButtonColor: "secondary",
  };

  const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return render(<ConfirmationDialog {...mergedProps} />);
  };

  test("renders correctly with title and children", () => {
    renderComponent();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("calls onConfirm when Confirm button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test("is accessible", async () => {
    renderComponent();

    const results = await axe(document.body);

    expect(results).toHaveNoViolations();
  });
});
