import {
  CircleAlert,
  Loader2,
  MessageSquare,
  MessagesSquare,
  Star,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import Commentcard from "./CommentCard";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { formatDate } from "@/utilities/formatDate";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRecoilValue } from "recoil";
import { likedReviewsAtom, userIdAtom, userRoleAtom } from "@/atoms/userData";
import { toast } from "sonner";

const ReviewCard = ({
  review,
  bookId,
}) => {
  const userId = useRecoilValue(userIdAtom);
  const role = useRecoilValue(userRoleAtom);
  const likedReviews = useRecoilValue(likedReviewsAtom);

  useEffect(() => {
    setIsLiked(likedReviews.includes(review?._id));
  }, [review, likedReviews]);

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = async () => {
    if (!!role) {
      setIsLikeLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/books/${bookId}/reviews/${
            review._id
          }/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setIsLikeLoading(false);
          setIsLiked(!isLiked);
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setIsLikeLoading(false));
    } else {
      setIsLiked(!isLiked);
      toast.error("You need to be logged in");
    }
  };

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    setIsDeleteLoading(true);
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/books/${bookId}/reviews/${
          review._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (userId === review.userId._id) setUserReplyCounter(-1);
        handleParentReload();
        toast.warning(response.data.message);
      })
      .catch((err) => toast.error(err.response.data.message))
      .finally(() => {
        setIsDeleteLoading(false);
        setOpen(false);
      });
  };


  return (
    <div className="flex flex-col border-2 rounded-md p-3 sm:p-4 mt-4 w-full overflow-y-auto border-slate-200 dark:border-zinc-800">
      <div className="flex items-center w-full gap-2 pb-2">
        <img
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg"
          src={`https://api.multiavatar.com/${review.userId._id}.svg`}
          alt="user"
        />
        <div className="flex flex-col items-start">
          <h4 className="text-lg font-medium tracking-tight">
            {review.userId.firstName + " " + review.userId.lastName}
          </h4>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                size={15}
                key={index}
                color={review.rating >= index + 1 ? "gold" : "#E2E8F0"}
                fill={review.rating >= index + 1 ? "gold" : "#E2E8F0"}
              />
            ))}
            <span className="text-gray-500 text-sm ml-3">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div>
        <blockquote className="ml-1 mb-2 sm:mb-4 italic text-sm sm:text-base">
          {review.content}
        </blockquote>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className={`gap-2 p-2 ${
              isLiked &&
              "bg-slate-200 border-2 border-slate-300 dark:border-zinc-500 dark:bg-zinc-800"
            }`}
            title={isLiked ? "unlike" : "like"}
            onClick={toggleLike}>
            {isLikeLoading ? (
              <Loader2
                strokeWidth={2.5}
                opacity={0.5}
                className="w-6 h-6 animate-spin"
              />
            ) : (
              <ThumbsUp />
            )}
            <span className="hidden md:flex">{isLiked ? "Liked" : "Like"}</span>
          </Button>
         

          
          {(role === "admin" || userId === review.userId._id) && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex ml-auto py-2 px-2 gap-2">
                  <Trash2 />
                  <span className="hidden md:flex">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    Review and all the Replies below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={handleDelete}>
                    {isDeleteLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>Delete</>
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
