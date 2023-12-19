import Loans from "./components/Loans";

const ShelfPage = () => {
  return (
    <div className="container">
      <div className="mt-3">
        <nav>
          <div className="nav nav-tabs" id="nav-tabs" role="tablist">
            <button
              className="nav-link active"
              id="nav-loans-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-loans"
              role="tab"
              aria-controls="nav-loans"
              aria-selected="true"
            >
              Loans
            </button>
            <button
              className="nav-link"
              id="nav-history-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-history"
              type="button"
              role="tab"
              aria-controls="nav-history"
              aria-selected="false"
            >
              Your History
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-loans"
            role="tabpanel"
            aria-labelledby="nav-loans-tab"
          >
            <Loans />
          </div>
          <div
            className="tab-pane fade"
            id="nav-history"
            role="tabpanel"
            aria-labelledby="nav-history-tab"
          >
            <p>Checkout History</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShelfPage;
