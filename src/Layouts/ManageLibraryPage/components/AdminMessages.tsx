import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import Pagination from "../../Utils/Pagination";
import AdminMessage from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

const AdminMessages = () => {
  const { authState } = useOktaAuth();
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //Recall useEffect
  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    const fetchUserMessage = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${
          currentPage - 1
        }&size=5`;
        const requestOptions = {
          method: "GET",
          header: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const messagesResponse = await fetch(url, requestOptions);
        if (!messagesResponse.ok) {
          throw new Error("Something went wrong");
        }
        const messagesResponseJson = await messagesResponse.json();

        setMessages(messagesResponseJson._embedded.messages);
        setTotalPages(messagesResponseJson.page.totalPages);
      }
      setLoading(false);
    };
    fetchUserMessage().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, btnSubmit]);

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

  async function submitResponseToQuestion(id: number, response: string) {
    const url = `http://localhost:8080/api/messages/secure/admin/message`;
    if (
      authState &&
      authState?.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const adminMessageRequest: AdminMessageRequest = new AdminMessageRequest(
        id,
        response
      );
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminMessageRequest),
      };
      const returnResponse = await fetch(url, requestOptions);
      if (!returnResponse.ok) {
        throw new Error("Something went wrong");
      }
      setBtnSubmit(!btnSubmit);
    }
  }

  const pagination = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              submitResponseToQuestion={submitResponseToQuestion}
              message={message}
              key={message.id}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
      )}
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
export default AdminMessages;
