import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    mainItem: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    if (response.ok === true) {
      const mainItem = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const similarProducts = data.similar_products.map(each => ({
        imageUrl: each.image_url,
        title: each.title,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
        id: each.id,
      }))
      this.setState({
        similarProducts,
        mainItem,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: data.error_msg,
      })
    }
  }

  onContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onAdd = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onRemove = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderMainProduct = () => {
    const {mainItem, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = mainItem
    return (
      <div>
        <div className="main-product-con">
          <div className="img-con">
            <img src={imageUrl} alt="product" className="main-img" />
          </div>
          <div className="data-con">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="product-detail">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="des">{description}</p>
            <div className="avl-brand-con">
              <h4>Available: </h4>
              <p className="val">{availability}</p>
            </div>
            <div className="avl-brand-con">
              <h4>Brand: </h4>
              <p className="val">{brand}</p>
            </div>
            <div className="avl-brand-con">
              <button data-testid="minus" onClick={this.onRemove} type="button">
                <BsDashSquare /> +
              </button>
              <p className="count">{count}</p>
              <button data-testid="plus" onClick={this.onAdd} type="button">
                <BsPlusSquare />-
              </button>
            </div>
            <button className="add-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarproduct()}
      </div>
    )
  }

  renderSimilarproduct = () => {
    const {similarProducts} = this.state
    return (
      <div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-ul">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              eachProduct={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoading = () => (
    <div data-testid="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSimilarFailure = () => {
    const {errorMsg} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>{errorMsg}</h1>
        <button type="button" onClick={this.onContinue}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMainProduct()
      case apiStatusConstants.failure:
        return this.renderSimilarFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderPage()}
      </div>
    )
  }
}

export default ProductItemDetails
