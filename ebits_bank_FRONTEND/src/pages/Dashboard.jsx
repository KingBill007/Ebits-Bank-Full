import React from 'react';
import '../styles/main.css';
import Card from '../components/Card';
//import data from '../data/Data';
import { useState , useEffect , useRef } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import {URL} from '../data/URL';
import Modal from 'react-modal';
import styles from '../styles/dashboard.module.css';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';//loading spinner


function Dashboard () {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [method, setmethod] = useState('');
    const [totalBal, settotalBal] = useState(202.20);
    const [depAmount, setdepAmount] = useState(0);
    const [desData, setdesData] = useState("");
    const [activeAccNo, setactiveaccNo] = useState();
    const modalType = useRef('');
    const [activeType, setactiveType] = useState('');
    const [createType, setcreatType] = useState('Current');
    const [depOpen,setdepOpen] = useState(false)
    const [createOpen,setcreateOpen] = useState(false)
    const [hasAccount, sethasAccount] = useState(false)
    const userId = Cookies.get('userId');
    const [selectVal, setselectVal] = useState('All')
    const [info, setInfo] = useState();
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    //ERROR display function
    const [errorOpen, seterrorOpen] = useState(false);
    const [errorMsg,seterrorMsg] = useState('Error');
    const showError = (message)=>{
        seterrorMsg("Error: "+message);
        seterrorOpen(true);
    }

    //navigation function
    const navigate = useNavigate();
    const navigateTo = (location) =>{
        navigate('/'+location);
    }

    //Check if userId has accounts and save accounts
    const checkAccounts = async () =>{
        try{
            //check if userId exist as cookie
            if (!userId){
                navigateTo('');
                return;
            }
            //get user details and store as cookie if they dont already exist
            if(!Cookies.get('fName') || !Cookies.get('lName') || !Cookies.get('email') || !Cookies.get('pNumber')){
                const user = await axios.get(`${URL.baseURL}${URL.API_URL}/users/getUser/${userId}`);
                console.log(user.data)
                Cookies.set('fName', user.data.message[0].fName, { expires: 3 });//store all user details as cookies
                Cookies.set('lName', user.data.message[0].lName, { expires: 3 });
                Cookies.set('email', user.data.message[0].email, { expires: 3 });
                Cookies.set('pNumber', user.data.message[0].pNumber, { expires: 3 });
            }
            
            //get user accounts
            const response = await axios.get(`${URL.baseURL}${URL.API_URL}/accounts/checkAcc/${userId}`);
            //console.log(response)
            if (response.data && response.data.length > 0){
                sethasAccount(true)
                setInfo(response.data)
                //console.log(response.data)
            }else{
                sethasAccount(false);
                setInfo([])
            }
            //filter the sum of user accounts
            const totalValue = response.data.filter(acc => acc.userId._id === userId).reduce((sum, acc) => sum + acc.Value, 0);
            settotalBal(totalValue)

            //get User transaction history
            const history = await axios.get(`${URL.baseURL}${URL.API_URL}/transactions/getuser/${userId}`);
            setdata(history.data.message);
            //console.log(history.data.message , `${URL.baseURL}${URL.API_URL}/transactions/getuser/${userId}`)

            if (errorOpen) {
                const timer = setTimeout(() => {
                seterrorOpen(false);  // this triggers fade-out
                }, 10000); // show for 3 seconds
            
                return () => clearTimeout(timer);
            }
        }catch(err){
            showError(err)
        }
    }
    useEffect(()=>{
        checkAccounts()
    },[errorOpen])

    //Opens Available Modals
    const openModal = async (method,type,modalName,accNo)=>{
        modalType.current = type;
        setactiveType(modalType.current);
        setmethod(method);
        setactiveaccNo(accNo)
        if ( modalName === 'depositModal' ){setdepOpen(true);}
        if ( modalName === 'createAccountModal' ){setcreateOpen(true);}
    }

    //deposit / withdraw
    const depositFunc = async ()=>{
        let Amount = 0
        if (method === 'Deposit'){
            Amount = depAmount;
        } else if(method === 'Withdraw'){
            Amount = -depAmount;
        }
        try{
            setisLoading(true)
            //send deposit to server
            const response = await axios.post(`${URL.baseURL}${URL.API_URL}/accounts/deposit`,{
                accNumber: activeAccNo,
                accType: activeType,
                amount: Number(Math.floor(Amount * 100) / 100),
                description: desData,
                userId: userId
            });
            //console.log(response.data)
            if (!response.data.Sucess){
                showError(response.data.message)
            }
            checkAccounts()
            setdepOpen(false);
            setisLoading(false)
        }catch(err){
            showError(err)
        }
    }

    //Create an account in the database
    const createAccount = async ()=>{
        try{
            const response = await axios.post(
                `${URL.baseURL}${URL.API_URL}/accounts/create`,
                {
                    type: createType,
                    userId: userId
                }
            );
            //console.log(createType)
            checkAccounts();
            setcreateOpen(false)
            if (!response.data.Sucess){
                showError(response.data.message)
            }
            //console.log('response: ',response)
        }catch(err){
            showError(err)
        }
    }
    
    return (
        <div className='screen'>
            <Header total={totalBal}/>
            <div className='content'>
                <div className='topContent'>
                    { hasAccount ? 
                        (
                            info.map((item,index)=>
                                <React.Fragment key={item._id}>
                                    <Card
                                        type={item.accType} 
                                        amount={item.Value} 
                                        account={item.accNumber} 
                                        func={openModal}    
                                    />
                                    {info.length < 2 ?
                                        <button onClick={()=>{setcreateOpen(true)}} style={{width:'10%',height:100}} ><FaPlus size={50} color='rgba(63, 63, 64, 0.46)' /></button> :
                                        <></>
                                    }
                                </React.Fragment>
                            )
                        )
                        :
                        (<div className={styles.noAccDiv}>
                            <p>You Have No Accounts.</p>
                            <button style={{height:40}} onClick={()=>{openModal(null,null,'createAccountModal')}}>Create Account</button>
                        </div>)
                    }    
                </div>
                <div className='bottomContent'>
                    <div className='upperBttm'>
                        <span style={{fontSize:19, fontWeight:'bold'}}>Transaction History</span>
                        <select value={selectVal} onChange={(val)=>setselectVal(val.target.value)}>
                            <option value="All">All Accounts</option>
                            <option value="Current">Current Account</option>
                            <option value="Savings">Savings Account</option>
                        </select>
                    </div>
                    <div className='lowerBttm'>
                        <table>
                            <thead>
                                <tr>
                                    <th>date</th>
                                    <th>description</th>
                                    <th>account</th>
                                    <th>ammount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.filter(item => selectVal==='All' || item.accType=== selectVal).map((info)=>
                                <tr key={info._id}>
                                    <td>{(()=>{
                                        //Date function
                                        const date = new Date(info.date);
                                        const month = MONTHS[date.getMonth()];
                                        const day = date.getDate();
                                        const year = date.getFullYear();
                                        const hour = date.getHours();
                                        const minute = String(date.getMinutes()).padStart(2, "0");
                                        const dateRefined = (`${month} ${day}, ${year} :: ${hour}:${minute}`)
                                        return dateRefined;
                                    })()}</td>
                                    <td>{info.description}</td>
                                    <td style={{color:'rgba(0, 72, 255, 1)'}}>{info.accType}</td>
                                    <td>{info.Value}</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

                <Modal //modal for deposit
                    name="depositModal"
                    isOpen={depOpen} 
                    onRequestClose={() => setdepOpen(false)} 
                    className={styles.modalContent} 
                    overlayClassName={styles.modalOverlay} 
                >
                        <h2>{activeType} Account</h2>
                        <input type='number' min='0' step={.01} placeholder='Gh₵ (2 decimal place)' onChange={(val)=>setdepAmount(Number(val.target.value))} />
                        <textarea onChange={(val)=>setdesData(val.target.value)}></textarea>
                        <button onClick={depositFunc} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            {isLoading ?
                                <Oval
                                    height={20}
                                    width={20}
                                    color="#012D9C"
                                    secondaryColor="#f3f3f3"
                                    strokeWidth={5}
                                    strokeWidthSecondary={5}
                                /> : 
                                method
                            }
                        </button>
                </Modal>
                <Modal //modal for create account
                    name="createAccountModal"
                    isOpen={createOpen} 
                    onRequestClose={() => setcreateOpen(false)} 
                    className={styles.modalContent} 
                    overlayClassName={styles.modalOverlay} 
                >
                        <h2>Create Account</h2>
                        <div style={{display:'flex',width:'100%',justifyContent:'space-around'}}>
                            <select value={createType} onChange={(val)=>setcreatType(val.target.value)}>
                                <option value="Current">Current Account</option>
                                <option value="Savings">Savings Account</option>
                            </select>   
                            <button onClick={createAccount}>Create account</button>
                        </div>
                </Modal>
                <Modal //modal for ERROR!!!
                    name="errorModal"
                    isOpen={errorOpen} 
                    onRequestClose={() => seterrorOpen(false)} 
                    className='errorContent' 
                    overlayClassName='errorOverlay'
                    closeTimeoutMS={300}   // wait 300ms before unmounting
                >
                    {errorMsg}
                </Modal>
        </div>
    )
}   
export default Dashboard
//make sure accNo doesnt already exist before saving acc