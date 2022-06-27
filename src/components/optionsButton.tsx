import Image from "next/image";
import { FC } from "react";

interface OptionsButtonProps {
  userId: string;
  authUserId?: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const OptionsButton: FC<OptionsButtonProps> = ({ userId, authUserId, onEditClick, onDeleteClick }) => {
  if (userId === authUserId) {
    return (
      <>
        <span className="text-[rgb(237,100,104)] ">
          <button onClick={onDeleteClick}>
            <Image src={"/img/icons/icon-delete.svg"} alt="delete comment" width={12} height={12} /> Delete
          </button>
        </span>
        <span className="ml-4 text-[rgb(84,87,182)]">
          <button onClick={onEditClick}>
            <Image src={"/img/icons/icon-edit.svg"} alt="edit comment" width={12} height={12} /> Edit
          </button>
        </span>
      </>
    );
  } else
    return (
      <span className="text-[rgb(84,87,182)] ">
        <button>
          <Image src={"/img/icons/icon-reply.svg"} alt="reply comment" width={12} height={12} /> Reply
        </button>
      </span>
    );
};

export default OptionsButton;
