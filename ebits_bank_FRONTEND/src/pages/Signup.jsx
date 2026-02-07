import '../styles/main.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {URL} from '../data/URL';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";


function Signup () {

  const [showPassword,setshowPassword] = useState(false)

  const [formData, setformData] = useState({
    fName:"",
    lName:"",
    email:"",
    pNumber:"",
    password:""
  })

  const navigate = useNavigate();
  const navigateTo = (location) =>{
    navigate('/'+location);
  }

  const Signup = async (e) =>{
    e.preventDefault();
    try{
        const response = await axios.post(
          `${URL.baseURL}${URL.API_URL}/users/addUser`,
          {
            fName: formData.fName,
            lName: formData.lName,
            email: formData.email,
            password: formData.password,
            pNumber: formData.pNumber
          }
        ) //save userdetails to server
        //console.log((response.data.userInfo).select('-password'))
        Cookies.set('fName', response.data.userInfo.fName, { expires: 3 });//store all user details as cookies
        Cookies.set('lName', response.data.userInfo.lName, { expires: 3 });
        Cookies.set('email', response.data.userInfo.email, { expires: 3 });
        Cookies.set('pNumber', response.data.userInfo.pNumber, { expires: 3 });
        Cookies.set('userId', response.data.userInfo._id, { expires: 3 });
        navigateTo('dashboard');//go to dashboard
    }catch(err){
      console.log(err)
    }
  }

  const handleChange =(e)=>{
    setformData({...formData,[e.target.name]: e.target.value})
  }

  return (
    <div className="App">
      <div className="container">
        <img src={logo} className="logoImg" alt="logo" />
        <h1>Ebits Bank</h1>
        <p className="subtitle">Sign Up to create your account</p>

        <form className="form" onSubmit={Signup}>
            
          <label>First Name</label>
          <input className="loginInput" type="text" name="fName"  value={formData.fName} onChange={handleChange} />

          <label>Last Name</label>
          <input className="loginInput" type="text" name="lName"  value={formData.lName} onChange={handleChange} />

          <label>Email</label>
          <input className="loginInput" type="email" name="email"  value={formData.email} onChange={handleChange} />

          <label>Phone Number</label>
          <input className="loginInput" type="tel" name="pNumber"  value={formData.pNumber} onChange={handleChange}/>

          <label>Password</label>
          <div style={{position:'relative'}}>
            <input className="loginInput" type={showPassword ? 'text' : "password"} name="password"  value={formData.password} onChange={handleChange} />
            <span 
            style={{position:'absolute',right:3,top:'20%'}}
            onClick={()=>{showPassword ? setshowPassword(false) : setshowPassword(true)}} >
              {showPassword ? <FaEye opacity={0.3} /> : <FaEyeSlash opacity={0.3} />}
            </span>
          </div>

          <button className="signInBtn" type="submit" >Sign Up</button>
        </form>

        <p className="forgot">Forgot password?</p>
        

        <p><span style={{fontSize:13}}>Dont have an account?</span>
        <button className="signUpBtnLight" onClick={()=>navigateTo('')}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
export default Signup;
