import { FC, SVGProps } from "react";

export type IconDirectionUpDownProps = SVGProps<SVGSVGElement> & {
  isOpen?: boolean;
};

export const IconDirectionUpDown: FC<IconDirectionUpDownProps> = ({
  isOpen = false,
  ...props
}) => {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
};
