"use client";

import {
  forwardRef,
  
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { Account } from "@/types/account.Types";
import CreateGroup from "@/actions/chat/CreateGroup";
import Form from "next/form";
import CreateGroupFooter from "./CreateGroupFooter";
import SelectParticipant from "./SelectParticipant";
import ConversationData from "./ConversationData";

export interface CreateGroupFormHandle {
  reset: () => void;
}

interface CreateGroupFormProps {
  accountId: string;
  initialAccounts: Account[];
  initialPage: number;
  initialHasNextPage: boolean;
  onCancel: () => void;
  onOpenChange: (value: boolean) => void;
}

const CreateGroupForm = forwardRef<CreateGroupFormHandle, CreateGroupFormProps>(
  function CreateGroupForm(
    {
      accountId,
      initialAccounts,
      initialPage,
      initialHasNextPage,
      onCancel,
      onOpenChange,
    },
    ref,
  ) {
    // ─── Owned state ────────────────────────────────────
    const [pending, startTransition] = useTransition();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [groupName, setGroupName] = useState("");

    const canSubmit =
      selected.size > 0 && groupName.trim().length >= 2 && !pending;

    // ─── Submit (receives FormData from <Form>) ─────────
    const handleSubmit = (formData: FormData) => {
      const selectedIds = Array.from(selected);
      const name = groupName.trim();

      if (selectedIds.length === 0) {
        toast.error("Select at least one account");
        return;
      }
      if (!name) {
        toast.error("Group name is required");
        return;
      }
      if (name.length < 2) {
        toast.error("Group name must be at least 2 characters");
        return;
      }

      formData.set("name", name);

      startTransition(async () => {
        const res = await CreateGroup(selectedIds, accountId, formData);
        if (!res.success) {
          toast.error(
            (res.errors as { message?: string })?.message ||
              "Failed to create group",
          );
          return;
        }
        toast.success("Group created successfully");
        onOpenChange(false);
      });
    };

    // ─── Render ─────────────────────────────────────────
    return (
      <Form action={handleSubmit} className="flex flex-col flex-1 min-h-0">
        {/* Image + Name */}

        <ConversationData groupName={groupName} setGroupName={setGroupName} pending={pending}/>
       

        <SelectParticipant
          accountId={accountId}
          initialAccounts={initialAccounts}
          initialPage={initialPage}
          initialHasNextPage={initialHasNextPage}
          selected={selected}
          setSelected={setSelected}
          pending={pending}
        />

        {/* PAGE 3 — Footer (pure props) */}
        <CreateGroupFooter
          selectedCount={selected.size}
          pending={pending}
          canSubmit={canSubmit}
          onCancel={onCancel}
        />
      </Form>
    );
  },
);

export default CreateGroupForm;
