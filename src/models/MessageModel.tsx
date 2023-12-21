class MessageModel {
  id?: number;
  title: string;
  question: string;
  userEmail?: string;
  adminEmail?: string;
  response?: string;
  closed?: boolean;

  constructor(title: string, question: string) {
    this.question = question;
    this.title = title;
  }
}

export default MessageModel;
