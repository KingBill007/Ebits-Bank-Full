import { IoMdExit } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from '../styles/dashboard.module.css'
import { useState } from "react";

function Header (props) {

    const fName = Cookies.get('fName');
    const lName = Cookies.get('lName');

    //navigation function
    const navigate = useNavigate();
    const navigateTo = (location) => {
    navigate("/" + location);
    };

    const navigateToProfile = ()=>{
        Cookies.set('totalAmount', props.total.toFixed(2))
        navigateTo('profile');
    }

    //Logout
    const logoutFunc = ()=>{
        try{
            Cookies.remove('userId');
            Cookies.remove('fName');
            Cookies.remove('lName');
            Cookies.remove('email');
            Cookies.remove('pNumber');
            Cookies.remove('totalAmount');
            navigateTo('');
        }catch(err){
            console.log(err)
        }
    }
    return (
            <div className='header'>
                <div className='leftHeader'>
                    <img src={logo} alt='logo' className='logoImg'/>
                    <div className='textHeaderleft'>
                        <span style={{fontSize:20,fontWeight:'bold',fontFamily:'sans-serif'}}>Ebits Bank</span>
                        <span style={{fontFamily:'sans-serif',fontSize:14}}>Online Banking</span>
                    </div>
                </div>

                <div className='rightHeader'>
                    <div className='textHeaderright'>
                        <span style={{fontSize:13,color:'rgba(0, 0, 0, 0.62)'}}>Total Balance</span>
                        <span style={{fontWeight: 'bold',fontSize: 20}}>{props.total ? props.total.toFixed(2) : Cookies.get('totalAmount')}</span>
                    </div>
                    <button className={styles.profile} onClick={navigateToProfile}><CiUser />{ fName + " " + lName }</button>
                    <button className='exitBttn' onClick={logoutFunc}><IoMdExit color='black' size={20} /></button>  
                </div>
            </div>
    )
}
export default Header;