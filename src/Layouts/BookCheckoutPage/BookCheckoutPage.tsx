import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import StarReview from "../Utils/StarReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import LastestReviews from "./LastestReviews";

const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loadingReview, setLoadingReview] = useState(true);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };
      setBook(loadedBook);
      setLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });
  }, [bookId]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://localhost:8080/api/reviews/search/findReviewByBookId?bookId=${bookId}`;

      const responseReview = await fetch(reviewUrl);
      if (!responseReview.ok) {
        throw new Error("Something went wrong");
      }
      const responseJsonReview = await responseReview.json();

      const responseDataReview = responseJsonReview._embedded.reviews;

      const loadedReview: ReviewModel[] = [];

      let weightedStarReview: number = 0;

      for (const key in responseDataReview) {
        loadedReview.push({
          id: responseDataReview[key].id,
          user_email: responseDataReview[key].user_email,
          date: responseDataReview[key].date,
          rating: responseDataReview[key].rating,
          book_id: responseDataReview[key].book_id,
          reviewDescription: responseDataReview[key].reviewDescription,
        });
        weightedStarReview =
          weightedStarReview + responseDataReview[key].rating;
      }

      if (loadedReview) {
        const round = (
          Math.round((weightedStarReview / loadedReview.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReview);
      setLoadingReview(false);
    };
    fetchBookReviews().catch((error: any) => {
      setLoadingReview(false);
      setHttpError(error.message);
    });
  }, []);

  if (loading || loadingReview) {
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

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width={"226"} height={"349"} alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width={"226"}
                height={"349"}
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
        <LastestReviews reviews={reviews} mobile={false} bookId={book?.id} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width={"226"} height={"349"} alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width={"226"}
              height={"349"}
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LastestReviews reviews={reviews} mobile={true} bookId={book?.id} />
      </div>
    </div>
  );
};
export default BookCheckoutPage;
