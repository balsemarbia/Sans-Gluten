import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Plus } from 'lucide-react';
import { apiCall, getToken } from '@/constants/api';

interface Review {
  _id: string;
  userId: {
    _id: string;
    nom: string;
  };
  rating: number;
  comment: string;
  helpful: number;
  notHelpful: number;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  averageRating?: number;
  totalReviews?: number;
}

export default function ProductReviews({ productId, averageRating = 0, totalReviews = 0 }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(false);
      // In a real app, you'd fetch reviews from an API
      // For now, we'll use mock data
      setReviews([]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    const token = getToken();
    if (!token) {
      alert('Vous devez être connecté pour laisser un avis');
      return;
    }

    try {
      // Submit review to API
      // await apiCall(`/products/${productId}/reviews`, 'POST', newReview, token);
      setReviews([...reviews, {
        _id: Date.now().toString(),
        userId: { _id: 'user', nom: 'Vous' },
        rating: newReview.rating,
        comment: newReview.comment,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date().toISOString()
      }]);
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la soumission de l\'avis');
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      // await apiCall(`/reviews/${reviewId}/helpful`, 'POST', { helpful }, getToken());
      setReviews(reviews.map(review =>
        review._id === reviewId
          ? {
              ...review,
              helpful: helpful ? review.helpful + 1 : review.helpful,
              notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
            }
          : review
      ));
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setUserRating(star)}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoverRating || userRating : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Avis clients</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-gray-500">({totalReviews} avis)</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Écrire un avis
          </button>
        </div>

        {/* Add Review Form */}
        {showAddReview && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Votre avis</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                {renderStars(newReview.rating, true)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Partagez votre expérience avec ce produit..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment.trim()}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Soumettre l'avis
                </button>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {review.userId.nom.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.userId.nom}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="text-sm text-gray-500">Cet avis est-il utile ?</span>
                <button
                  onClick={() => handleHelpful(review._id, true)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Oui ({review.helpful})
                </button>
                <button
                  onClick={() => handleHelpful(review._id, false)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Non ({review.notHelpful})
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors ml-auto">
                  <Flag className="w-4 h-4" />
                  Signaler
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun avis pour le moment</h3>
            <p className="text-gray-600 mb-6">Soyez le premier à donner votre avis !</p>
            <button
              onClick={() => setShowAddReview(true)}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Écrire un avis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
