import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
    if (authState?.isAuthenticated && title !== "" && question !== "") {
      const messageRequestModel: MessageModel = new MessageModel(
        title,
        question
      );
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };
      const returnResponse = await fetch(url, requestOptions);
      if (!returnResponse.ok) {
        throw new Error("Something went wrong");
      }
      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className="card mt-3">
      <div className="card-header">Ask question to Luv 2 Read Admin</div>
      <div className="card-body">
        <form action="" method="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}
          {displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question added successfully
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextArea1"
              rows={3}
              placeholder="Question"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              onClick={() => submitNewQuestion()}
              type="button"
              className="btn btn-primary mt-3"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostNewMessage;
