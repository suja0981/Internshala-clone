import React from "react";

type StatusType =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offered"
  | "approved"
  | "rejected"
  | "pending"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  applied:     { label: "Applied",     className: "badge badge-applied" },
  shortlisted: { label: "Shortlisted", className: "badge badge-shortlisted" },
  interview:   { label: "Interview",   className: "badge badge-interview" },
  offered:     { label: "Offered",     className: "badge badge-offered" },
  approved:    { label: "Approved",    className: "badge badge-approved" },
  rejected:    { label: "Rejected",    className: "badge badge-rejected" },
  pending:     { label: "Pending",     className: "badge badge-pending" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const key = (status || "").toLowerCase();
  const config = STATUS_MAP[key] ?? {
    label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown",
    className: "badge badge-pending",
  };

  return (
    <span
      className={config.className}
      style={size === "sm" ? { fontSize: "0.7rem", padding: "2px 8px" } : {}}
    >
      {config.label}
    </span>
  );
}
