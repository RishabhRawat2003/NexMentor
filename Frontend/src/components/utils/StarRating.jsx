import { FaStar, FaRegStar } from 'react-icons/fa';


export const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center justify-center">
            {[...Array(5)].map((_, index) => (
                <span key={index}>
                    {index < rating ? (
                        <FaStar size={15} className="text-yellow-500" />
                    ) : (
                        <FaRegStar size={15} className="text-gray-300" />
                    )}
                </span>
            ))}
        </div>
    );
};