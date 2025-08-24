import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import '../componentStyles/Navbar.css';
import '../pageStyles/Search.css';
import { useSelector } from 'react-redux';


function Navbar() {
  const [isMenuOpne , setIsMenuOpen] = useState(false);
  const[isSearchOpen, setIsSearchOpen] = useState(false);
  const[SearchQuery, setSearchQuery] = useState("");

  const toggelSearch=()=>setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpne);
  const {isAuthenticated, cartItems} = useSelector(state=>state.user)
  const navigate = useNavigate();
  const handleSearchSubmit=(e)=>{
    e.preventDefault();
    if(SearchQuery.trim()){
      navigate(`/products?keyword=${encodeURIComponent(SearchQuery.trim())}`);

    }
    else{
      navigate(`/products`)
    }
    setSearchQuery("");
  }


  return (
    <nav className='navbar'>
      <div className='navbar-container'>
            <div className='navbar-logo'>
                <Link to="/" onClick={()=>setIsMenuOpen(false)}>ShopEasy</Link>
            </div>


            <div className={`navbar-links ${isMenuOpne ? 'active' : ""}`}>
              <ul>
                  <li>  <Link to="/" onClick={()=>setIsMenuOpen(false)}>Home</Link> </li>
                  <li>  <Link to="/products">Products</Link> </li>
                  <li>  <Link to="/about-us">About Us</Link> </li>
                  <li>  <Link to="/contact-us">Contact Us</Link> </li>
              </ul> 
            </div>


            <div className='navbar-icons'>
                <div className='search-container'>
                  <form className={`search-form ${isSearchOpen?'active':''}`} onSubmit={handleSearchSubmit}>
                      <input type="text" className='search-input' placeholder='Search Products'
                      value={SearchQuery}
                      onChange={(e)=>setSearchQuery(e.target.value)}
                      />
                      <button type='button' className='search-icon' onClick={toggelSearch}>
                        <SearchIcon focusable='false'/>
                      </button>
                  </form>
                </div>

                <div className='cart-container'>
                  <Link to='/cart'>
                   <ShoppingCartIcon className='icon'/>
                   {cartItems > 0 && <span className='cart-badge'>{cartItems}</span>}
                  </Link>

                </div>

               { !isAuthenticated &&<Link to='/register' className='register-link'>
                <PersonAddIcon className = 'icon'/>
                </Link>}
                <div className='navbar-hamburger' onClick={toggleMenu}>
                  { isMenuOpne?  <CloseIcon className = 'icon'/>:<MenuIcon className='icon' />   } 
                </div>
            </div>
      </div>
    </nav>
  )
}

export default Navbar

