import { FC, ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="self-end bg-[rgb(84,87,182)] w-32 text-white hover:bg-[rgb(195,196,239)] focus:ring-1 rounded-lg py-3 px-6"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
