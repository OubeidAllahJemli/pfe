'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { SafeReview, SafeUser } from "@/app/types";
import { FaStar } from "react-icons/fa";
import Avatar from "../Avatar";
import ReviewInput from "../inputs/ReviewInput";

interface ListingReviewProps {
    reviews: SafeReview[];
    onSubmitReview: SubmitHandler<ReviewFormInputs>;
    isLoading: boolean;
    currentUser: SafeUser | null;
}

interface ReviewFormInputs {
    rating: string;
    comment: string;
    
}

const ListingReview: React.FC<ListingReviewProps> = ({
    reviews,
    onSubmitReview,
    isLoading,
    currentUser,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ReviewFormInputs>();

    return (
        <div>
            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="mt-4 space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border p-4 rounded-lg shadow-sm bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Avatar src={review.user.image} height={40} width={40} /> 
                                        <div className="ml-3">
                                            <span className="font-semibold">{review.user.name}</span>
                                            <div className="flex items-center ml-2 text-gray-600">
                                                
                                                <span>{review.rating}/5</span>
                                                <FaStar className="mb-1.5 ml-1 text-yellow-500 " /> 
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="mt-2">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500">No reviews yet.</p>
                )}
            </div>
          

            
            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Leave a Review</h2>
                <form onSubmit={handleSubmit(onSubmitReview)} className="mt-4 space-y-4">
                
                    <div className="border p-4 rounded-lg shadow-sm bg-white">
                        <label htmlFor="rating" className="block text-md font-medium text-gray-700">Rating</label>
                        <div className="border p-1 rounded-lg  bg-white">
                        <select
                            id="rating"
                            {...register("rating", { required: true })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm rounded-md"
                            defaultValue="" 
                        >
                            <option value="" disabled>Select a rating !</option>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={String(rating)}>{rating}</option>
                            ))}
                        </select>
                        
                        {errors.rating && <span className="text-red-500">Please select a rating.</span>}
                       </div>
                        <div className="mt-4">
                        <ReviewInput
                            id="comment"
                            label="Comment"
                            type="textarea"
                            register={register}
                            required={true}
                            errors={errors}
                        />
                        {errors.comment && <span className="text-red-500">Please enter a comment.</span>}
                        </div>
                    </div>
                   
                  

                 
                    

              
                    <button
                        type="submit"
                            className="
                            inline-flex 
                            justify-center 
                            py-2 
                            px-4 
                            border 
                            border-transparent 
                            shadow-sm 
                            text-sm 
                            font-medium 
                            rounded-md
                            text-white
                            bg-indigo-600
                            hover:bg-indigo-700 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-offset-2
                                focus:ring-indigo-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  
                </form>
            </div>
            
        </div>
    );
};

export default ListingReview;
