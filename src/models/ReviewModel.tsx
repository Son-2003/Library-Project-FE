class ReviewModel {
  id: number;
  user_email: string;
  date: string;
  rating: number;
  book_id: number;
  reviewDescription: string;
  constructor(
    id: number,
    user_email: string,
    date: string,
    rating: number,
    book_id: number,
    reviewDescription: string
  ) {
    (this.id = id), (this.user_email = user_email), (this.date = date);
    this.rating = rating;
    this.book_id = book_id;
    this.reviewDescription = reviewDescription;
  }
}

export default ReviewModel;
