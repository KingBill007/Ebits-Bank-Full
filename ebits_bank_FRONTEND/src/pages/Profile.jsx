import Header from "../components/Header";
import '../styles/main.css';
import user from '../assets/user.png';
import { BiUser } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

function Profile() {

    //User details in cookies
    const fName = Cookies.get('fName');
    const lName = Cookies.get('lName');
    const email = Cookies.get('email');
    const pNumber = Cookies.get('pNumber');

    //navigation function
    const navigate = useNavigate();
    const navigateTo = (location) => {
    navigate("/" + location);
    };

    return(
        <div className="screen">
            <Header />
            <div className="profileContent">
                <button className="backBttn"onClick={()=>navigateTo('dashboard')} ><IoArrowBackOutline size={18} style={{marginRight:8}}/>Back to Dashboard</button>
                <div className="info">
                    <div className="pTitle">
                        <img src={user} alt='user' className="userImg"/>
                        <div className="pTitleText">
                            <span style={{fontWeight:'bold',fontSize:20}}>{ fName + " " + lName }</span>
                            <span style={{fontSize:15,color:'#000000a2'}}>Account holder</span>
                        </div>
                    </div> 
                    <div className="pBody">
                        <label><BiUser size={15} style={{marginRight:'5'}} />First name</label>
                        <input className="pInput" placeholder={fName}></input>

                        <label><BiUser size={15} style={{marginRight:'5'}} />Last name</label>
                        <input className="pInput" placeholder={lName}></input>

                        <label><MdOutlineEmail size={15} style={{marginRight:'5'}} />Email Address</label>
                        <input className="pInput" placeholder={email}></input>

                        <label><FiPhone size={15} style={{marginRight:'5'}} />Phone Number</label>
                        <input className="pInput" placeholder={pNumber}></input>

                        <button className="pUpdate">Update Profile</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile;