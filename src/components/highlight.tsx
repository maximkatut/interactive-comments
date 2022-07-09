interface HighlightProps {
  comment: string;
  userName: string;
}

const Highlight = ({ comment, userName }: HighlightProps) => {
  const regex = new RegExp("(\\W|^)@(" + userName + ")(\\W|$)", "ig");
  const commentArray = comment.split(regex);
  if (commentArray.length > 1) {
    return (
      <p>
        {commentArray.map((item, index) => {
          if (item === userName) {
            return (
              <span key={index} className="font-bold text-[rgb(84,87,182)]">
                @{item}
              </span>
            );
          }
          return item;
        })}
      </p>
    );
  }
  return <p>{comment}</p>;
};

export default Highlight;
