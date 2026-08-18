export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size}>
        {/* Cuadrado de fondo */}
        <rect width="100" height="100" rx="24" fill="#2563EB" />
        {/* Columna 1 */}
        <rect x="22" y="25" width="14" height="50" rx="4" fill="white" opacity="0.9" />
        {/* Columna 2 (más corta) */}
        <rect x="43" y="25" width="14" height="35" rx="4" fill="white" opacity="0.7" />
        {/* Columna 3 (más larga) */}
        <rect x="64" y="25" width="14" height="60" rx="4" fill="white" />
      </svg>
    </div>
  );
}
