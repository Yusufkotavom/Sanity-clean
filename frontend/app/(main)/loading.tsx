export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-primary/20">
      <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-primary rounded-full" />
    </div>
  );
}
