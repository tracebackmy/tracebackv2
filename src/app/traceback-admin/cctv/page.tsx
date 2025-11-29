import CCTVViewer from "@/components/CCTVViewer";

export default function CCTVPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">CCTV Investigation Module</h1>
      <p className="text-muted">Access station feeds to identify lost items visually.</p>
      <CCTVViewer />
    </div>
  );
}