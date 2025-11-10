"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function GuidelinePopup() {
  const [open, setOpen] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenGuidelineMessage");
    setTimeout(() => {
      if (!seen) setOpen(true);
      setCheckedStorage(true);
    }, 0);
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("hasSeenGuidelineMessage", "true");
  };

  if (!checkedStorage) return null;

  return (
    <>
      {!localStorage.getItem("hasSeenGuidelineMessage") && (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          variant="secondary"
          className="fixed bottom-6 right-6 z-50"
        >
          📜 Guidelines
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Community Guidelines
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-gray-700 dark:text-gray-300 space-y-2">
            Welcome! Follow these rules when posting or commenting:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>✍️ Create your own discussion threads.</li>
              <li>
                💬 Share posts under threads; comments update in real-time.
              </li>
              <li>📌 Be respectful and stay on topic.</li>
              <li>
                🚫 Avoid spam or promotional messages, e.g.,{" "}
                <strong>“Buy now”</strong>, <strong>“Click here”</strong>.
              </li>
              <li>
                ⚠️ Avoid toxic or violent language, hate speech, harassment, or
                adult content. AI will detect violations.
              </li>
              <li>
                ✅ Following these rules ensures your posts are approved
                automatically.
              </li>
            </ul>
          </p>
          <DialogFooter>
            <Button onClick={handleClose}>Got it ✅</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
