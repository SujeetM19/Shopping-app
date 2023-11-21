import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./layout/MetaData";
import  Pagination from 'react-js-pagination'

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );


  const {keyword} = useParams();

  useEffect(() => {
      if(error){
        alert.error(error);
      }

    dispatch(getProducts(keyword, currentPage));

  }, [dispatch,alert, keyword, currentPage, error]);

  function setCurrentPageNo(pageNumber){
    setCurrentPage(pageNumber)
  }


  return (
    <Fragment>
      {loading || !products ? (
        <Loader/>
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Porducts Online"} />

          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>

          {resPerPage <= productsCount &&

          <div className="d-flex justify-content-center mt-5">
            <Pagination activePage={currentPage}
            itemsCountPerPage={resPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText ={'Next'}
            prevPageText ={'Prev'}
            firstPageText ={'First'}
            lastPageText ={'Last'}
            itemClass="page-item"
            linkClass="page-link"
            />
          </div>
          }
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
