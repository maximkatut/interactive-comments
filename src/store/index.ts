import create from "zustand";

interface State {
  modalIsShowed: boolean;
  deletingCommentId: string | null;
  setModalIsShowed: (bool: boolean) => void;
  setDeletingCommentId: (commentId: string) => void;
}

export const useStore = create<State>((set) => ({
  modalIsShowed: false,
  deletingCommentId: null,
  setModalIsShowed: (bool) => set(() => ({ modalIsShowed: bool })),
  setDeletingCommentId: (commentId) => set(() => ({ deletingCommentId: commentId })),
}));
