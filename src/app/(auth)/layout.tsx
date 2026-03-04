export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-radial-at-c from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}
