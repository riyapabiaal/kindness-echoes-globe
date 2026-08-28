import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPin, fetchPins, type KindnessPin } from "@/lib/kindness";

const GlobeView = lazy(() => import("@/components/GlobeView"));

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Echoes of Kindness — A Living Map of Human Goodness" },
      {
        name: "description",
        content:
          "A glowing 3D globe of real acts of kindness from around the world. Read a story, or drop your own golden pin.",
      },
      { property: "og:title", content: "Echoes of Kindness — A Living Map of Human Goodness" },
      {
        property: "og:description",
        content:
          "A glowing 3D globe of real acts of kindness from around the world. Read a story, or drop your own golden pin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const qc = useQueryClient();
  const { data: pins = [], isLoading } = useQuery({ queryKey: ["pins"], queryFn: fetchPins });

  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<{ lat: number; lng: number } | null>(null);
  const [selected, setSelected] = useState<KindnessPin | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  const mutation = useMutation({
    mutationFn: createPin,
    onSuccess: (pin) => {
      qc.setQueryData<KindnessPin[]>(["pins"], (old) => [pin, ...(old ?? [])]);
      setDraft(null);
      setPlacing(false);
      setFocus({ lat: pin.lat, lng: pin.lng });
      toast.success("Your light is on the map", { description: "Thank you for the echo." });
    },
    onError: () => toast.error("Could not save that story. Please try again."),
  });

  useEffect(() => {
    if (placing) toast("Click anywhere on the globe to place your pin");
  }, [placing]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,var(--glow-warm),transparent_65%)]" />

      <div className="absolute inset-0">
        <ClientOnly fallback={<GlobeSkeleton />}>
          <Suspense fallback={<GlobeSkeleton />}>
            <GlobeView
              pins={pins}
              placing={placing}
              focus={focus}
              onPick={(c) => setDraft(c)}
              onSelect={(p) => setSelected(p)}
            />
          </Suspense>
        </ClientOnly>
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 md:p-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-primary/80">
            A living map of human goodness
          </p>
          <h1 className="mt-2 font-display text-3xl leading-none text-foreground md:text-5xl">
            Echoes of Kindness
          </h1>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Every light is a real act of kindness, pinned to the exact spot where it happened.
          </p>
        </div>
        <div className="hidden text-right md:block">
          <div className="font-display text-4xl text-primary">{pins.length}</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {isLoading ? "loading" : "echoes glowing"}
          </div>
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 p-6 md:p-10">
        <Button
          variant={placing ? "secondary" : "default"}
          size="lg"
          className="pointer-events-auto rounded-full px-8 shadow-[0_0_40px_-6px_var(--glow-strong)]"
          onClick={() => {
            setPlacing((p) => !p);
            setDraft(null);
          }}
        >
          {placing ? (
            <>
              <X className="mr-2 size-4" /> Cancel placing
            </>
          ) : (
            <>
              <MapPin className="mr-2 size-4" /> Drop a Pin
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Hover a light to preview · click it to read the full story
        </p>
      </div>

      {selected && <StoryCard pin={selected} onClose={() => setSelected(null)} />}

      {draft && (
        <PinForm
          coords={draft}
          pending={mutation.isPending}
          onCancel={() => setDraft(null)}
          onSubmit={(values) => mutation.mutate({ ...values, ...draft })}
        />
      )}

      <Toaster position="top-center" />
    </main>
  );
}

function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-64 animate-pulse rounded-full bg-primary/10 blur-2xl" />
    </div>
  );
}

function StoryCard({ pin, onClose }: { pin: KindnessPin; onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-6 md:bottom-auto md:right-8 md:top-1/2 md:inset-x-auto md:-translate-y-1/2 md:px-0">
      <article className="pointer-events-auto w-full max-w-sm rounded-2xl border border-primary/25 bg-card/85 p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">{pin.location_name}</p>
          <button onClick={onClose} aria-label="Close story" className="text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-4 font-display text-lg leading-relaxed text-foreground">"{pin.story}"</p>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Heart className="size-3 text-primary" />
          {pin.author_name ? `Shared by ${pin.author_name}` : "Shared anonymously"}
        </p>
      </article>
    </div>
  );
}

function PinForm({
  coords,
  pending,
  onCancel,
  onSubmit,
}: {
  coords: { lat: number; lng: number };
  pending: boolean;
  onCancel: () => void;
  onSubmit: (v: { story: string; location_name: string; author_name: string }) => void;
}) {
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-2xl border border-primary/25 bg-card p-7"
        onSubmit={(e) => {
          e.preventDefault();
          if (story.trim().length < 5) {
            toast.error("Tell us a little more about the moment");
            return;
          }
          onSubmit({ story, location_name: location, author_name: author });
        }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="size-4" />
          <span className="text-[10px] uppercase tracking-[0.3em]">Add your echo</span>
        </div>
        <h2 className="mt-3 font-display text-2xl text-foreground">What kindness happened here?</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story">The story</Label>
            <Textarea
              id="story"
              value={story}
              maxLength={500}
              rows={4}
              placeholder="A stranger paid for my coffee and disappeared before I could say thanks…"
              onChange={(e) => setStory(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loc">Place name</Label>
              <Input
                id="loc"
                value={location}
                maxLength={120}
                placeholder="Lisbon, Portugal"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Your name (optional)</Label>
              <Input
                id="author"
                value={author}
                maxLength={60}
                placeholder="Anonymous"
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Lighting it up…" : "Light the pin"}
          </Button>
        </div>
      </form>
    </div>
  );
}
