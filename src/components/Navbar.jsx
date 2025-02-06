import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
	const [visible, setVisible] = useState(false); // State for small screen menu visibility
	const { setShowSearch, getCartCount } = useContext(ShopContext); // Context values

	// Helper function for NavLink styles
	const navLinkStyle = ({ isActive }) =>
		`flex flex-col items-center gap-1 ${
			isActive ? "border-b-4 border-black pb-2" : ""
		}`;

	return (
		<div className="flex items-center justify-between py-5 font-medium relative">
			{/* Logo */}
			<Link to="/">
				<img src={assets.logo} className="w-36" alt="Logo" />
			</Link>

			{/* Navigation Links for Large Screens */}
			<ul className="hidden sm:flex gap-5 text-sm text-gray-700">
				<NavLink to="/" className={navLinkStyle} end>
					<p>HOME</p>
				</NavLink>
				<NavLink to="/collection" className={navLinkStyle}>
					<p>COLLECTION</p>
				</NavLink>
				<NavLink to="/about" className={navLinkStyle}>
					<p>ABOUT</p>
				</NavLink>
				<NavLink to="/contact" className={navLinkStyle}>
					<p>CONTACT</p>
				</NavLink>
			</ul>

			{/* Right-side Icons */}
			<div className="flex items-center gap-4">
				{/* Search Icon */}
				<img
					onClick={() => setShowSearch(true)}
					src={assets.search_icon}
					className="w-5 cursor-pointer"
					alt="Search Icon"
				/>

				{/* Profile Dropdown */}
				<div className="group relative">
					<Link to='/login'><img
						className="w-5 cursor-pointer"
						src={assets.profile_icon}
						alt="Profile Icon"
					/></Link>
					<div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20">
						<div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
							<p className="cursor-pointer hover:text-black">My Profile</p>
							<p className="cursor-pointer hover:text-black">Orders</p>
							<p className="cursor-pointer hover:text-black">Logout</p>
						</div>
					</div>
				</div>

				{/* Cart Icon */}
				<Link to="/cart" className="relative">
					<img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart Icon" />
					<p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
						{getCartCount() || 0}
					</p>
				</Link>

				{/* Menu Icon for Small Screens */}
				<div className="sm:hidden relative">
					<img
						onClick={() => setVisible(!visible)}
						src={assets.menu_icon}
						className="w-5 cursor-pointer"
						alt="Menu Icon"
					/>

					{/* Dropdown Menu */}
					{visible && (
						<div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-30">
							<NavLink
								onClick={() => setVisible(false)}
								to="/"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
							>
								HOME
							</NavLink>
							<NavLink
								onClick={() => setVisible(false)}
								to="/collection"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
							>
								COLLECTION
							</NavLink>
							<NavLink
								onClick={() => setVisible(false)}
								to="/about"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
							>
								ABOUT
							</NavLink>
							<NavLink
								onClick={() => setVisible(false)}
								to="/contact"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
							>
								CONTACT
							</NavLink>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
