import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { KindnessPin } from "@/lib/kindness";

type Props = {
  pins: KindnessPin[];
  placing: boolean;
  onPick: (coords: { lat: number; lng: number }) => void;
  onSelect: (pin: KindnessPin) => void;
  focus?: { lat: number; lng: number } | null;
};

export default function GlobeView({ pins, placing, onPick, onSelect, focus }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.minDistance = 160;
    controls.maxDistance = 600;
    g.pointOfView({ lat: 18, lng: 8, altitude: 2.4 }, 0);
  }, [size.w]);

  useEffect(() => {
    if (focus && globeRef.current) {
      globeRef.current.pointOfView({ lat: focus.lat, lng: focus.lng, altitude: 1.6 }, 1200);
    }
  }, [focus]);

  const rings = useMemo(
    () => pins.slice(0, 40).map((p) => ({ lat: p.lat, lng: p.lng })),
    [pins],
  );

  return (
    <div
      ref={wrapRef}
      className={`h-full w-full ${placing ? "cursor-crosshair" : "cursor-grab"}`}
    >
      {size.w > 0 && (
        <Globe
          ref={globeRef as never}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/textures/earth-dark.jpg"
          showAtmosphere
          atmosphereColor="#f3c969"
          atmosphereAltitude={0.18}
          pointsData={pins}
          pointLat={(d) => (d as KindnessPin).lat}
          pointLng={(d) => (d as KindnessPin).lng}
          pointColor={() => "#ffd77a"}
          pointAltitude={0.02}
          pointRadius={0.32}
          pointsMerge={false}
          pointLabel={(d) => {
            const p = d as KindnessPin;
            return `<div style="max-width:260px;padding:10px 12px;border-radius:12px;background:rgba(14,13,20,0.92);border:1px solid rgba(243,201,105,0.35);color:#f7f3e8;font-size:12px;line-height:1.45;backdrop-filter:blur(8px)">
              <div style="color:#f3c969;font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px">${escapeHtml(p.location_name)}</div>
              ${escapeHtml(p.story)}
            </div>`;
          }}
          onPointClick={(d) => onSelect(d as KindnessPin)}
          ringsData={rings}
          ringColor={() => (t: number) => `rgba(243,201,105,${1 - t})`}
          ringMaxRadius={2.6}
          ringPropagationSpeed={0.9}
          ringRepeatPeriod={2600}
          onGlobeClick={({ lat, lng }) => {
            if (placing) onPick({ lat, lng });
          }}
        />
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
