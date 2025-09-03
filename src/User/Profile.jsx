import React, { useEffect, useState } from 'react'
import '../UserStyles/Profile.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'


function profile() {
  const {loading , isAunthenticated ,user} = useSelector(state=>state.user)
  const [imageError, setImageError] = useState(false);
  console.log(user);
  const navigate = useNavigate();
  useEffect(()=>{
    if(isAunthenticated===false){
      navigate("/login");
    }
  },[isAunthenticated])

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiByeD0iMTI1IiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjEyNSIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmb250LXdlaWdodD0iYm9sZCI+VXNlcjwvdGV4dD4KPC9zdmc+';
    }
    return user?.avatar?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiByeD0iMTI1IiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjEyNSIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmb250LXdlaWdodD0iYm9sZCI+VXNlcjwvdGV4dD4KPC9zdmc+';
  };

  return (
    <>
   {loading?(<Loader/>): (<div className="profile-container">
      <PageTitle title={`${user.name} Profile`}/>
      <div className="profile-image">
        <h1 className="profile-heading">My Profile</h1>
        <div className="profile-image-container">
          <img 
            src={getImageSrc()}
            alt="User Profile" 
            className="user-avatar" 
            onError={handleImageError}
            onLoad={() => console.log('Image loaded successfully')}
          />
        </div>
        <Link to="/profile/update">Edit Profile</Link>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <h2>Username</h2>
          <p>{user.name}</p>
        </div>
        <div className="profile-detail">
          <h2>Email:</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-detail">
          <h2>Joined on:</h2>
          <p>{user.createdAt?String(user.createdAt).substring(0,10):'N/A'}</p>
        </div>
      </div>

      <div className="profile-buttons">
        <Link to="/orders">My Orders</Link>
        <Link to="/password/update">Change Password</Link>
      </div>
    </div>)}
    </>
  )
}

export default profile
