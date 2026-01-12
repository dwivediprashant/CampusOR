import Kiosk from "../../../../components/kiosk/Kiosk";

type PageProps = {
  params: { queueId: string };
};

export default function KioskQueuePage({ params }: PageProps) {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Kiosk queueId={params.queueId} />
    </main>
  );
}
