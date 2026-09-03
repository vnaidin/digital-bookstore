import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Image, Stack } from "@mantine/core";

import { getImageUrl, PLACEHOLDER_IMG } from "@/utils/helpers";

interface Props {
  imgKey: string;
  label: string;
  existingSrc?: string;
  setImages: React.Dispatch<React.SetStateAction<Record<string, File | null>>>;
}

export default function UploadButton({ imgKey, label, existingSrc, setImages }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const src = preview ?? (existingSrc ? getImageUrl(existingSrc) : null);

  return (
    <Stack align="center" gap="xs">
      {src && <Image src={src} fallbackSrc={PLACEHOLDER_IMG} alt={label} maw={200} />}
      <label style={{ cursor: "pointer", background: "var(--ink)", color: "white", borderRadius: 24, padding: "4px 12px" }}>
        <FiUpload size={20} />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setImages((p) => ({ ...p, [imgKey]: file }));
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </label>
      <span>{label}</span>
    </Stack>
  );
}
