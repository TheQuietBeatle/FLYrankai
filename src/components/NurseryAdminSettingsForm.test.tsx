import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NurseryAdminSettingsForm } from "../NurseryAdminSettingsForm";

/**
 * Fills every field with valid data. Returns the userEvent instance so callers
 * can perform further interactions (e.g. submitting).
 */
async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/administrator name/i), "Amira Hassan");
  await user.type(
    screen.getByLabelText(/contact email/i),
    "amira@sunflower-nursery.eg",
  );
  await user.type(
    screen.getByLabelText(/emergency phone/i),
    "+201012345678",
  );
  await user.click(screen.getByLabelText(/email alerts/i));
  return user;
}

describe("NurseryAdminSettingsForm", () => {
  it("submits successfully when all fields are valid", async () => {
    const onSubmit = vi.fn();
    render(<NurseryAdminSettingsForm onSubmit={onSubmit} />);

    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      adminName: "Amira Hassan",
      contactEmail: "amira@sunflower-nursery.eg",
      emergencyPhone: "+201012345678",
      emailAlertsEnabled: true,
    });

    // No error messages should be rendered on a valid submission.
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("blocks submission and renders errors when required fields are empty", async () => {
    const onSubmit = vi.fn();
    render(<NurseryAdminSettingsForm onSubmit={onSubmit} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    // Submission must be blocked.
    await waitFor(() =>
      expect(screen.getByText(/administrator name is required/i)).toBeInTheDocument(),
    );
    expect(onSubmit).not.toHaveBeenCalled();

    // Each required field surfaces an inline error.
    expect(
      screen.getByText(/administrator name is required/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/contact email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/emergency phone is required/i)).toBeInTheDocument();

    // Accessibility: the invalid inputs are flagged and linked to their errors.
    const nameInput = screen.getByLabelText(/administrator name/i);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAccessibleDescription(
      /administrator name is required/i,
    );
  });

  it("rejects a malformed phone number", async () => {
    const onSubmit = vi.fn();
    render(<NurseryAdminSettingsForm onSubmit={onSubmit} />);

    const user = userEvent.setup();
    await user.type(
      screen.getByLabelText(/administrator name/i),
      "Amira Hassan",
    );
    await user.type(
      screen.getByLabelText(/contact email/i),
      "amira@sunflower-nursery.eg",
    );
    // Local Egyptian format, missing the +20 international prefix.
    await user.type(screen.getByLabelText(/emergency phone/i), "01012345678");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/enter an egyptian mobile in international format/i),
      ).toBeInTheDocument(),
    );
    expect(onSubmit).not.toHaveBeenCalled();

    const phoneInput = screen.getByLabelText(/emergency phone/i);
    expect(phoneInput).toHaveAttribute("aria-invalid", "true");
  });
});