"use client";

import { useState } from "react";
import { deleteJob } from "../actions";

export default function DeleteJobButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={async () => {
        const confirmed = window.confirm(
          `Delete "${jobTitle}"? This permanently deletes the job and all of its photos and videos from storage. This can't be undone.`,
        );
        if (!confirmed) return;
        setDeleting(true);
        await deleteJob(jobId);
      }}
      className="text-sm font-semibold uppercase tracking-wide text-red-800 hover:opacity-70 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Job"}
    </button>
  );
}
