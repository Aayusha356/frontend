import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ catogery, subCatogery }) => {
	const { products } = useContext(ShopContext);
	const [related, setRelated] = useState([]);

	useEffect(() => {
		if (products.length > 0) {
			let productsCopy = products.slice();
			productsCopy = productsCopy.filter((item) => catogery === item.catogery);
			productsCopy = productsCopy.filter(
				(item) => subCatogery === item.subCatogery
			);

			setRelated(productsCopy.slice(0, 5));
		}
	}, [products, catogery, subCatogery]); // Add dependencies here

	return (
		<div className="my-16 px-4">
			<div className="text-center">
				<Title text1="RELATED" text2="PRODUCTS" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
				{related.map((item) => (
					<ProductItem
						key={item.id}
						id={item.id}
						name={item.name}
						price={item.price}
						image={item.image}
					/>
				))}
			</div>
		</div>
	);
};

export default RelatedProducts;
