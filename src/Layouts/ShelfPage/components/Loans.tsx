import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import LoansModal from "./LoansModal";

const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(null);

  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const shelfCurrentLoansResponse = await fetch(url, requestOptions);
        if (!shelfCurrentLoansResponse.ok) {
          throw new Error("Something went wrong");
        }
        const shelfCurrentLoansResponseJson =
          await shelfCurrentLoansResponse.json();
        setShelfCurrentLoans(shelfCurrentLoansResponseJson);
      }
      setLoading(false);
    };
    fetchUserCurrentLoans().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, checkout]);

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

  async function returnBook(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }
    setCheckout(!checkout);
  }

  async function renewLoan(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/renew/loan?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }
    setCheckout(!checkout);
  }
  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans: </h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {shelfCurrentLoan.book.img ? (
                      <img
                        src={shelfCurrentLoan.book.img}
                        width={"226"}
                        height={"349"}
                        alt="Book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width={"226"}
                        height={"349"}
                        alt="Book"
                      />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan Option</h4>
                        {shelfCurrentLoan.daysLeft > 0 && (
                          <p className="text-sencondary">
                            Due in {shelfCurrentLoan.daysLeft} days
                          </p>
                        )}
                        {shelfCurrentLoan.daysLeft === 0 && (
                          <p className="text-success">Due Today.</p>
                        )}
                        {shelfCurrentLoan.daysLeft < 0 && (
                          <p className="text-danger">
                            Past due by {shelfCurrentLoan.daysLeft} days
                          </p>
                        )}
                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link
                            to="/search"
                            className="list-group-item list-group-item-action"
                          >
                            Search more book?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">
                        Help other find their adventure by reviewing your loan
                      </p>
                      <Link
                        to={`/checkout/${shelfCurrentLoan.book.id}`}
                        className="btn btn-primary"
                      >
                        Search more book?
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  mobile={false}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link to={`/search`} className="btn btn-primary">
              Search for a new book
            </Link>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className="mb-3">Current Loans: </h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {shelfCurrentLoan.book.img ? (
                    <img
                      src={shelfCurrentLoan.book.img}
                      width={"226"}
                      height={"349"}
                      alt="Book"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      width={"226"}
                      height={"349"}
                      alt="Book"
                    />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body container">
                    <div className="mt-3">
                      <h4>Loan Option</h4>
                      {shelfCurrentLoan.daysLeft > 0 && (
                        <p className="text-sencondary">
                          Due in {shelfCurrentLoan.daysLeft} days
                        </p>
                      )}
                      {shelfCurrentLoan.daysLeft === 0 && (
                        <p className="text-success">Due Today.</p>
                      )}
                      {shelfCurrentLoan.daysLeft < 0 && (
                        <p className="text-danger">
                          Past due by {shelfCurrentLoan.daysLeft} days
                        </p>
                      )}
                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                        >
                          Manage Loan
                        </button>
                        <Link
                          to="/search"
                          className="list-group-item list-group-item-action"
                        >
                          Search more book?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">
                      Help other find their adventure by reviewing your loan
                    </p>
                    <Link
                      to={`/checkout/${shelfCurrentLoan.book.id}`}
                      className="btn btn-primary"
                    >
                      Search more book?
                    </Link>
                  </div>
                </div>
                <hr />
                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  mobile={true}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link to={`/search`} className="btn btn-primary">
              Search for a new book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Loans;
