import { useLayoutEffect, useMemo, useState } from "react";
import { useTexture } from "@react-three/drei";
import { types as t } from "@theatre/core";
import { useCurrentSheet } from "@theatre/r3f";
import { DoubleSide } from "three";
import {
  getSpriteOngDongFrameUrls,
  SPRITE_ONG_DONG_FRAME_COUNT,
} from "./spriteOngDongConfig";

const THEATRE_OBJECT_KEY = "01_22_ong_dong_frame";

/**
 * Plane hiển thị chuỗi WebP; chỉ số frame do Theatre điều khiển (keyframe prop `frame`).
 * Phải nằm trong SheetProvider.
 */
export function SpriteOngDong({
  frameCount = SPRITE_ONG_DONG_FRAME_COUNT,
  planeArgs = [1, 1],
}) {
  const sheet = useCurrentSheet();
  const [frame, setFrame] = useState(0);
  const urls = useMemo(() => getSpriteOngDongFrameUrls(frameCount), [frameCount]);
  const textures = useTexture(urls);

  useLayoutEffect(() => {
    if (!sheet) return undefined;

    const obj = sheet.object(THEATRE_OBJECT_KEY, {
      frame: t.number(0, {
        label: "Frame",
        range: [0, Math.max(0, frameCount - 1)],
        nudgeMultiplier: 1,
      }),
    });

    const max = Math.max(0, frameCount - 1);
    const applyFrame = (v) => {
      setFrame(Math.min(max, Math.max(0, Math.round(v.frame))));
    };
    applyFrame(obj.value);

    const unsub = obj.onValuesChange(applyFrame);

    return () => {
      unsub();
      sheet.detachObject(THEATRE_OBJECT_KEY);
    };
  }, [sheet, frameCount]);

  const map = textures[frame] ?? textures[0];

  return (
    <mesh>
      <planeGeometry args={planeArgs} />
      <meshBasicMaterial map={map} transparent side={DoubleSide} toneMapped={false} />
    </mesh>
  );
}
