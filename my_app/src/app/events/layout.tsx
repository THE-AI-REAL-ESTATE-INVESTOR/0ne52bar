export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="pt-8 pb-16">
        {children}
      </div>
    </div>
  );
} 