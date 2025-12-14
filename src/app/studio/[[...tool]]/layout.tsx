export const metadata = {
  title: 'Boshnovart Studio',
  description: 'Content management for Boshnovart Portfolio',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Return children directly without wrapper
  // This will use the root layout but we'll override the styling in the page
  return <>{children}</>
}

