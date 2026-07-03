import React, { useEffect, useState } from 'react'
import Hero from '../Components/Layout/Hero'
import GenderCollectionSection from '../Components/Products/GenderCollectionSection'
import NewArrivals from '../Components/Products/NewArrivals'
import ProductDetails from '../Components/Products/ProductDetails';
import ProductGrid from '../Components/Products/ProductGrid';
import FeaturedCollection from '../Components/Products/FeaturedCollection';
import FeaturedSection from '../Components/Products/FeaturedSection';
import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api"
import { fetchProductsByFilters } from '../redux/slices/productsSlice';



const Home = () => {
    const dispatch = useDispatch();
    const { products, loading , error } = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
        //Fetch ptoducts for a specific collection
        dispatch(
            fetchProductsByFilters({
                gender: "Women",
                category: "Bottom Wear",
                limit: 8,
            })
        );
        //Fetch best seller product
        const fetchBestSeller = async () => {
            try{
                const response = await api.get(
                    `/products/best-seller`
                );
                setBestSellerProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBestSeller();
    },[dispatch]);

  return (
    <div>
      <Hero/>
      <GenderCollectionSection/>
      <NewArrivals/>

      {/* BestSeller */}
      <h2 className='text-3xl text-center font-bold mb-4'>
        Best Seller
      </h2>
      {bestSellerProduct ? (
      <ProductDetails productId = {bestSellerProduct._id}/>
      ) : (
        <p className='text-center'>Loading best seller product...</p>
      )}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Top Wears for Women
        </h2>
        <ProductGrid products= {products} loading={loading} error = {error}/>
        <FeaturedCollection/>
        <FeaturedSection/>
      </div>
    </div>
);
};

export default Home
