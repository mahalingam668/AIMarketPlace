import { Quote, Star } from 'lucide-react';
import type { GigReview } from '../types/gig.types';
import './ReviewList.css';

interface ReviewListProps {
  reviews: GigReview[];
}

function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="review-list__empty">No reviews yet.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-list__card">
          <Quote size={16} className="review-list__quote-icon" />
          <div className="review-list__stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.round(review.rating) ? '#f59e0b' : 'transparent'}
                stroke="#f59e0b"
              />
            ))}
          </div>
          <p className="review-list__comment">{review.comment}</p>
          <div className="review-list__footer">
            <span className="review-list__author">{review.author}</span>
            <span className="review-list__date">{review.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
