import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For getting route parameters
import { getDatabase, ref, get } from 'firebase/database';
import { db } from './firebase'; // Ensure Firebase is configured correctly

const ItemDetails = () => {
    const { itemId, category } = useParams(); // Extract itemId and category from route parameters

    const [itemDetails, setItemDetails] = useState(null); // State to store item details
    const [loading, setLoading] = useState(true); // Loading state
    const [reviews, setReviews] = useState([]); // State to store reviews

    // Fetch item details from Firebase when the component mounts
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const dbRef = ref(db, `Menu/${category}/${itemId}`); // Reference to the specific item in the database
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    setItemDetails(snapshot.val()); // Store item details in state
                } else {
                    console.log("Item not found");
                }
            } catch (error) {
                console.error("Error fetching item details:", error);
            } finally {
                setLoading(false); // Set loading to false when the data is fetched
            }
        };

        fetchItemDetails();
    }, [itemId, category]);

    // Fetch reviews from Firebase
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsRef = ref(db, 'Reviews/');
                const snapshot = await get(reviewsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const filteredReviews = Object.values(data).filter(review => review.orderNumber === itemId);
                    setReviews(filteredReviews); // Store reviews in state
                } else {
                    console.log("No reviews found for this item");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [itemId]);

    const handleAddToCart = () => {
        console.log('Item added to cart');
        // Logic for adding the item to the cart can be implemented here
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div className="loader" style={styles.loader}></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    if (!itemDetails) {
        return (
            <div style={styles.container}>
                <p>Item not found</p>
            </div>
        );
    }

    const { item: itemName, description = 'No description available', price = 0, img = '' } = itemDetails; // Destructure item details

    return (
        <div style={styles.container}>
            <img src={img || 'https://via.placeholder.com/250'} alt={itemName} style={styles.productImage} />

            <h2 style={styles.productName}>{itemName}</h2>

            <p style={styles.productDescription}>{description}</p>

            <p style={styles.productPrice}>R {price.toFixed(2)}</p>

            <button style={styles.addToCartButton} onClick={handleAddToCart}>
                ADD TO CART
            </button>

            {/* Reviews Section */}
            <h3 style={styles.reviewsTitle}>Reviews</h3>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} style={styles.reviewContainer}>
                        <p style={styles.reviewOrder}>Order: {review.orderNumber}</p>
                        <p style={styles.reviewText}>{review.reviewText}</p>
                        <p style={styles.reviewRating}>Rating: {review.rating}/5</p>
                    </div>
                ))
            ) : (
                <p>No reviews available for this item.</p>
            )}
        </div>
    );
};

// CSS-in-JS Styles (you can also use a CSS file)
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    loader: {
        border: '8px solid #f3f3f3', /* Light grey */
        borderTop: '8px solid #223d3c', /* Darker color */
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
    },
    productImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
    productName: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '10px 0',
    },
    productDescription: {
        fontSize: '16px',
        color: '#555',
    },
    productPrice: {
        fontSize: '20px',
        color: '#223d3c',
        margin: '10px 0',
    },
    addToCartButton: {
        padding: '10px 20px',
        backgroundColor: '#223d3c',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    reviewsTitle: {
        fontSize: '20px',
        marginTop: '20px',
        marginBottom: '10px',
    },
    reviewContainer: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        margin: '5px 0',
    },
    reviewOrder: {
        fontWeight: 'bold',
    },
    reviewText: {
        margin: '5px 0',
    },
    reviewRating: {
        color: '#ffcc00',
    },
};

export default ItemDetails;
