import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import StarReview from "../Utils/StarReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import LastestReviews from "./LastestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loadingReview, setLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  //Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(false);

  //Is Book Checkout
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

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
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findReviewByBookId?bookId=${bookId}`;

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
          userEmail: responseDataReview[key].userEmail,
          date: responseDataReview[key].date,
          rating: responseDataReview[key].rating,
          bookId: responseDataReview[key].bookId,
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
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    };
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckoutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const bookCheckedOut = await fetch(url, requestOptions);
        if (!bookCheckedOut.ok) {
          throw new Error("Something went wrong!");
        }
        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckoutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong!");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);
  if (
    loading ||
    loadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
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

  async function checkoutBook() {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsReviewLeft(true);
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
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthentication={authState?.isAuthenticated}
            isBookCheckout={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
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
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthentication={authState?.isAuthenticated}
          isBookCheckout={isCheckedOut}
          checkoutBook={checkoutBook}
          submitReview={submitReview}
          isReviewLeft={isReviewLeft}
        />
        <hr />
        <LastestReviews reviews={reviews} mobile={true} bookId={book?.id} />
      </div>
    </div>
  );
};
export default BookCheckoutPage;
