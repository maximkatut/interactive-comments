import Image from "next/image";
import { FC } from "react";

interface OptionButtonProps {
  styles: string;
  onClick: () => void;
  img: string;
  title: string;
}

const OptionButton: FC<OptionButtonProps> = ({ styles, onClick, img, title }) => {
  return (
    <>
      <span className={`${styles} hover:opacity-50`}>
        <button onClick={onClick}>
          <Image src={img} alt={`${title} button`} width={12} height={12} /> {title}
        </button>
      </span>
    </>
  );
};

export default OptionButton;
