import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./layout/MetaData";
import Pagination from "react-js-pagination";
import Slider from "rc-slider";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  // console.log(category);

  const categories = [
    "Electronics",
    "Camera",
    "Laptops",
    "Mobile",
    "Headphones",
    "Accessories",
    "Cameras",
    "Food",
    "Books",
    "Sports",
    "Clothes",
    "Home",
    "Beauty",
    "Others",
  ];

  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage, category, rating));
  }, [dispatch, alert, keyword, currentPage, error, category, rating]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }


  return (
    <Fragment>
      {loading || !products ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Porducts Online"} />

          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <hr className="my-5" />

                    <div className="mt-5">
                      <h4 className="mb-3">Categories</h4>

                      <ul className="pl-0">
                        {categories.map((category) => (
                          <li
                            style={{ cursor: "pointer", listStyleType: "none" }}
                            key={category}
                            onClick={() => setCategory(category)}
                          >
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <hr className="my-5" />

                    <div className="mt-5">
                      <h4 className="mb-3">Rating</h4>

                      <ul className="pl-0">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <li
                            style={{ cursor: "pointer", listStyleType: "none" }}
                            key={star}
                            onClick={() => setRating(star)}
                          >
                              <div className="rating-outer">
                                  <div className="rating-inner"
                                    style={{
                                      width:`${star * 20}%`
                                    }}
                                  
                                  >

                                  </div>
                              </div>
                          </li>
                        ))}
                      </ul>
                    </div>



                  </div>
                  

                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))
              )}
            </div>
          </section>
  
          {resPerPage <= productsCount && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
