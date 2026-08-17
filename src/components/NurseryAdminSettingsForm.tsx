"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NurseryAdminSettings } from "@/types/settings";

/**
 * Egyptian mobile number in international format.
 *
 * Shape: `+20` country code, then `1`, then a network digit (0, 1, 2, or 5),
 * then 8 subscriber digits — e.g. `+201012345678`.
 */
const EGYPT_MOBILE_REGEX = /^\+201[0125]\d{8}$/;

const settingsSchema = z.object({
  adminName: z
    .string()
    .trim()
    .min(1, { message: "Administrator name is required." }),
  contactEmail: z
    .string()
    .trim()
    .min(1, { message: "Contact email is required." })
    .email({ message: "Enter a valid email address." }),
  emergencyPhone: z
    .string()
    .trim()
    .min(1, { message: "Emergency phone is required." })
    .regex(EGYPT_MOBILE_REGEX, {
      message:
        "Enter an Egyptian mobile in international format, e.g. +201012345678.",
    }),
  emailAlertsEnabled: z.boolean(),
});

/**
 * The validated form values. Kept structurally compatible with the shared
 * `NurseryAdminSettings` interface so callers can persist the result directly.
 */
type SettingsFormValues = z.infer<typeof settingsSchema>;

// Compile-time guarantee that the schema stays in sync with the shared type.
const _typeCheck: NurseryAdminSettings = {} as SettingsFormValues;
void _typeCheck;

export interface NurseryAdminSettingsFormProps {
  /** Initial values for the form. Sensible defaults are used when omitted. */
  defaultValues?: Partial<NurseryAdminSettings>;
  /** Called with validated settings when the form is submitted successfully. */
  onSubmit?: (values: NurseryAdminSettings) => void | Promise<void>;
}

export function NurseryAdminSettingsForm({
  defaultValues,
  onSubmit,
}: NurseryAdminSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onSubmit",
    defaultValues: {
      adminName: defaultValues?.adminName ?? "",
      contactEmail: defaultValues?.contactEmail ?? "",
      emergencyPhone: defaultValues?.emergencyPhone ?? "",
      emailAlertsEnabled: defaultValues?.emailAlertsEnabled ?? false,
    },
  });

  // Stable, unique id prefix so multiple instances can coexist on a page
  // without colliding label / aria-describedby wiring.
  const fieldId = useId();
  const ids = {
    adminName: `${fieldId}-adminName`,
    adminNameError: `${fieldId}-adminName-error`,
    contactEmail: `${fieldId}-contactEmail`,
    contactEmailError: `${fieldId}-contactEmail-error`,
    emergencyPhone: `${fieldId}-emergencyPhone`,
    emergencyPhoneHelp: `${fieldId}-emergencyPhone-help`,
    emergencyPhoneError: `${fieldId}-emergencyPhone-error`,
    emailAlerts: `${fieldId}-emailAlerts`,
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit?.(values);
  });

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 " +
    "placeholder:text-stone-400 shadow-sm transition-colors " +
    "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 " +
    "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-200";

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-label="Nursery administrator settings"
      className="mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-stone-800">
          Administrator settings
        </h2>
        <p className="text-sm text-stone-500">
          Manage who receives nursery alerts and how families can reach you.
        </p>
      </div>

      {/* Administrator Name */}
      <div className="space-y-1.5">
        <label
          htmlFor={ids.adminName}
          className="block text-sm font-medium text-stone-700"
        >
          Administrator name
        </label>
        <input
          id={ids.adminName}
          type="text"
          autoComplete="name"
          placeholder="Amira Hassan"
          aria-invalid={errors.adminName ? true : undefined}
          aria-describedby={errors.adminName ? ids.adminNameError : undefined}
          className={inputClass}
          {...register("adminName")}
        />
        {errors.adminName && (
          <p id={ids.adminNameError} role="alert" className="text-red-600 text-sm">
            {errors.adminName.message}
          </p>
        )}
      </div>

      {/* Contact Email */}
      <div className="space-y-1.5">
        <label
          htmlFor={ids.contactEmail}
          className="block text-sm font-medium text-stone-700"
        >
          Contact email
        </label>
        <input
          id={ids.contactEmail}
          type="email"
          autoComplete="email"
          placeholder="admin@sunflower-nursery.eg"
          aria-invalid={errors.contactEmail ? true : undefined}
          aria-describedby={
            errors.contactEmail ? ids.contactEmailError : undefined
          }
          className={inputClass}
          {...register("contactEmail")}
        />
        {errors.contactEmail && (
          <p
            id={ids.contactEmailError}
            role="alert"
            className="text-red-600 text-sm"
          >
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      {/* Emergency Phone */}
      <div className="space-y-1.5">
        <label
          htmlFor={ids.emergencyPhone}
          className="block text-sm font-medium text-stone-700"
        >
          Emergency phone
        </label>
        <input
          id={ids.emergencyPhone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+201012345678"
          aria-invalid={errors.emergencyPhone ? true : undefined}
          aria-describedby={
            errors.emergencyPhone
              ? `${ids.emergencyPhoneHelp} ${ids.emergencyPhoneError}`
              : ids.emergencyPhoneHelp
          }
          className={inputClass}
          {...register("emergencyPhone")}
        />
        <p id={ids.emergencyPhoneHelp} className="text-sm text-stone-500">
          Egyptian mobile in international format, e.g. +201012345678.
        </p>
        {errors.emergencyPhone && (
          <p
            id={ids.emergencyPhoneError}
            role="alert"
            className="text-red-600 text-sm"
          >
            {errors.emergencyPhone.message}
          </p>
        )}
      </div>

      {/* Email Alerts toggle */}
      <div className="flex items-start gap-3">
        <input
          id={ids.emailAlerts}
          type="checkbox"
          className="mt-0.5 h-5 w-5 rounded border-stone-300 text-amber-600 focus:ring-2 focus:ring-amber-200"
          {...register("emailAlertsEnabled")}
        />
        <label
          htmlFor={ids.emailAlerts}
          className="text-sm font-medium text-stone-700"
        >
          Email alerts
          <span className="mt-0.5 block font-normal text-stone-500">
            Receive an email when an incident or urgent update is logged.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

export default NurseryAdminSettingsForm;