import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {imageUrl, title, price, brand, rating} = eachProduct
  return (
    <li className="similar-li">
      <img src={imageUrl} alt="similar product" className="similar-img" />
      <h1 className="sm-heading">{title}</h1>
      <p className="by-brand">by {brand}</p>
      <div className="price-rating-con">
        <h3>Rs {price}/-</h3>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
