import { FC, ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  styles?: string;
}

export const BUTTON_OPTIONS = {
  SEND: "bg-[rgb(84,87,182)] hover:bg-[rgb(195,196,239)] w-32",
  DELETE: "bg-[rgb(237,100,104)] hover:bg-[rgb(255,184,187)] w-40",
  GREY: "bg-[rgb(103,114,126)] hover:bg-[rgba(103,114,126,0.5)] w-40",
};

const Button: FC<ButtonProps> = ({ onClick, children, isLoading, styles }) => {
  return (
    <button
      disabled={isLoading}
      className={`${styles} w-32 text-white  focus:ring-1 rounded-lg py-3 px-6`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
