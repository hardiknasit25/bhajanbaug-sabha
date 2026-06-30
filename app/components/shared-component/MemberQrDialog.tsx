import { Download, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { downloadBlob, safeFileName } from "~/utils/downloadBlob";
import {
  buildMemberQrCard,
  displayMemberName,
} from "~/utils/memberQrCard";

interface MemberQrDialogProps {
  memberId: number;
  // Display name shown on the card and used for the downloaded file name.
  memberName?: string;
  smkNo?: string | null;
  mobile?: string | null;
  // Header (hall / community name) printed at the top of the card.
  headerTitle?: string;
  // Size of the trigger icon (matches sibling header / card icons).
  iconSize?: number;
  className?: string;
}

/**
 * Reusable trigger + dialog that previews a member's GPay-style QR card and lets
 * the user download it as a PNG. Used both in the member details header and in
 * the members-list cards, so the card is built once via the shared util.
 */
export default function MemberQrDialog({
  memberId,
  memberName,
  smkNo,
  mobile,
  headerTitle,
  iconSize = 18,
  className,
}: MemberQrDialogProps) {
  const [open, setOpen] = useState(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = displayMemberName(memberName, memberId);

  // Reset the cached card if the member changes (this instance is reused when
  // navigating between member detail pages).
  useEffect(() => {
    setCardUrl(null);
    setError(null);
  }, [memberId]);

  // (Re)build the card while the dialog is open whenever the member's data
  // changes. We depend on the card inputs (not a cached flag) so late-loaded
  // data — e.g. the details page filling in `mobile` after mount — is reflected
  // instead of being stuck on a stale card.
  // NOTE: `generating` must NOT be a dependency — toggling it would re-run this
  // effect and its cleanup would cancel the in-flight build, hanging the loader.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setGenerating(true);
    setError(null);
    (async () => {
      try {
        const url = await buildMemberQrCard({
          memberId,
          name: memberName,
          smk: smkNo,
          mobile,
          header: headerTitle,
        });
        if (!cancelled) setCardUrl(url);
      } catch (err) {
        console.error("Failed to generate member QR card", err);
        if (!cancelled) setError("Could not generate the QR code.");
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, memberId, memberName, smkNo, mobile, headerTitle]);

  const handleDownload = async () => {
    if (!cardUrl) return;
    try {
      // data: URLs are fetchable in the browser; convert to a Blob so we can
      // reuse the shared downloadBlob helper for a consistent download path.
      const blob = await (await fetch(cardUrl)).blob();
      const name = safeFileName(displayName, `member_${memberId}`);
      downloadBlob(blob, `qr_${name}.png`);
    } catch (err) {
      console.error("Failed to download member QR card", err);
      setError("Could not download the QR code.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Show member QR code"
          className={className}
          // Stop the click from bubbling to a parent (e.g. the member card's
          // navigate-to-details handler) while still opening the dialog.
          onClick={(e) => e.stopPropagation()}
        >
          <QrCode size={iconSize} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Member QR Code</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="flex min-h-[320px] items-center justify-center">
          {generating ? (
            <Spinner className="size-8 text-primaryColor" />
          ) : error ? (
            <p className="px-4 text-center text-sm text-red-600">{error}</p>
          ) : cardUrl ? (
            <img
              src={cardUrl}
              alt={`QR code for ${displayName}`}
              className="mx-auto max-h-[65vh] w-auto max-w-full rounded-lg"
            />
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={!cardUrl || generating}
            className="w-full sm:w-auto"
          >
            <Download className="size-4" />
            Download QR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
