import { IoMdExit } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from '../styles/header.module.css'

function Header (props) {

    const fName = Cookies.get('fName');
    const lName = Cookies.get('lName');

    const navigate = useNavigate();
    const navigateTo = (location) => {
    navigate("/" + location);
    };

    const navigateToProfile = ()=>{
        Cookies.set('totalAmount', props.total.toFixed(2))
        navigateTo('profile');
    }

    const logoutFunc = ()=>{
        try{
            Cookies.remove('userId');
            Cookies.remove('fName');
            Cookies.remove('lName');
            Cookies.remove('email');
            Cookies.remove('pNumber');
            Cookies.remove('totalAmount');
            Cookies.remove('isAdmin');
            navigateTo('');
        }catch(err){
            console.log(err)
        }
    }
    return (
            <div className={styles.header}>
                <div className={styles.left}>
                    <img src={logo} alt='logo' className={styles.logo}/>
                    <div className={styles.brand}>
                        <span className={styles.brandName}>Ebits Bank</span>
                        <span className={styles.brandTagline}>Online Banking</span>
                    </div>
                    <button className={styles.createBtn} onClick={props.add}>+ Create Account</button>
                </div>

                <div className={styles.right}>
                    <div className={styles.balance}>
                        <span className={styles.balanceLabel}>Total Balance</span>
                        <span className={styles.balanceValue}>GH₵ {props.total ? props.total.toFixed(2) : Cookies.get('totalAmount')}</span>
                    </div>
                    <button className={styles.profileBtn} onClick={navigateToProfile}><CiUser size={16} />{ fName + " " + lName }</button>
                    <button className={styles.logoutBtn} onClick={logoutFunc}><IoMdExit size={18} /></button>  
                </div>
            </div>
    )
}
export default Header;