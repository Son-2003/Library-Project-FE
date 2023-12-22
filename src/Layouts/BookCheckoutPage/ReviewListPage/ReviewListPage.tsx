import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import Review from "../../Utils/Review";
import Pagination from "../../Utils/Pagination";

const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, ssetTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${
        process.env.REACT_APP_API
      }/reviews/search/findReviewByBookId?bookId=${bookId}&pages=${
        currentPage - 1
      }&size=${booksPerPage}`;

      const responseReview = await fetch(reviewUrl);
      if (!responseReview.ok) {
        throw new Error("Something went wrong");
      }
      const responseJsonReview = await responseReview.json();

      const responseDataReview = responseJsonReview._embedded.reviews;

      ssetTotalAmountOfBooks(responseJsonReview.page.totalElements);
      setTotalPages(responseJsonReview.page.totalPages);

      const loadedReview: ReviewModel[] = [];

      for (const key in responseDataReview) {
        loadedReview.push({
          id: responseDataReview[key].id,
          userEmail: responseDataReview[key].userEmail,
          date: responseDataReview[key].date,
          rating: responseDataReview[key].rating,
          bookId: responseDataReview[key].bookId,
          reviewDescription: responseDataReview[key].reviewDescription,
        });
      }

      setReviews(loadedReview);
      setLoading(false);
    };
    fetchBookReviews().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="container m-5">
        <SpinnerLoading />
      </div>
    );
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage + 1;
  let lastBook =
    currentPage * booksPerPage <= totalAmountOfBooks
      ? currentPage * booksPerPage
      : totalAmountOfBooks;
  const pagination = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-5">
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstBook} to {lastBook} of {totalAmountOfBooks} items:
      </p>
      <div className="row">
        {reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={pagination}
        />
      )}
    </div>
  );
};
export default ReviewListPage;
