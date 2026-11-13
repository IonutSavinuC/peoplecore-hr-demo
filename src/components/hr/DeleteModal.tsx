import { AlertTriangle } from "lucide-react";
import { fullName, type Employee } from "@/lib/hr";
import { Btn, Modal } from "./primitives";

export function DeleteModal({ employee, onCancel, onConfirm }: { employee: Employee; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal testId="delete-modal" labelledBy="delete-modal-title" onClose={onCancel} className="max-w-md">
      <div className="p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive-soft text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h2 id="delete-modal-title" className="mt-4 text-lg font-bold text-foreground">
          Remove employee
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Are you sure you want to remove {fullName(employee)}?</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Btn variant="outline" data-testid="cancel-delete-btn" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn variant="danger" data-testid="confirm-delete-btn" onClick={onConfirm}>
          Delete
        </Btn>
      </div>
    </Modal>
  );
}
