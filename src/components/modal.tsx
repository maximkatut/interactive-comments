import { FC } from "react";
import { useStore } from "store/imdex";
import { trpc } from "utils/trpc";
import Button, { BUTTON_OPTIONS } from "./button";

interface ModalProps {
  commentId: string;
}

const Modal: FC<ModalProps> = ({ commentId }) => {
  const client = trpc.useContext();
  const { setModalIsShowed } = useStore();
  const { mutate: deleteRates } = trpc.useMutation("rate.deleteRates");
  const { mutate: deleteComment, isLoading } = trpc.useMutation("comments.delete", {
    onSuccess: async () => {
      if (commentId) {
        await client.invalidateQueries(["comments.get-all"]);
        deleteRates({
          commentId,
        });
        setModalIsShowed(false);
      }
    },
  });

  const handleDeleteClick = () => {
    if (commentId) {
      deleteComment({
        id: commentId,
      });
    }
  };

  const handleCancelClick = () => {
    setModalIsShowed(false);
  };

  return (
    <div className="flex justify-center items-center fixed w-screen h-screen overflow-hidden z-10 bg-[rgba(0,0,0,0.5)]">
      <div className="max-w-[400px] rounded-lg bg-white p-8">
        <h2 className="font-bold text-2xl mb-4">Delete comment</h2>
        <p className="mb-4">
          Are you sure you want to delete this comment? This will remove the comment and can&apos;t be undone.
        </p>
        <div className="flex justify-between">
          <Button onClick={handleCancelClick} styles={BUTTON_OPTIONS.GREY}>
            NO, CANCEL
          </Button>
          <Button onClick={handleDeleteClick} styles={BUTTON_OPTIONS.DELETE}>
            {isLoading ? "DELETING..." : "YES, DELETE"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
