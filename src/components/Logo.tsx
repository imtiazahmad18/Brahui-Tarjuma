import Image from "next/image";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

/** The central brand mark. Theme variants are selected by the root .dark class. */
export default function Logo({ className = "", width = 176, height = 138, priority = false, sizes }: LogoProps) {
  const shared = { width, height, priority, sizes };
  return (
    <span className={`brand-logo ${className}`} style={{ width, height }}>
      <Image {...shared} src="/brand/logo.png" alt="Brahui Laozaank" className="brand-logo-image brand-logo-light" />
      <Image {...shared} src="/brand/logo-dark.png" alt="Brahui Laozaank" className="brand-logo-image brand-logo-dark" />
    </span>
  );
}
