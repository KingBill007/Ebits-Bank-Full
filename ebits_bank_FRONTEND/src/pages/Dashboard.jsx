import React from 'react';
import '../styles/main.css';
import Card from '../components/Card';
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
import { IoArrowUndoCircleOutline } from "react-icons/io5";


function Dashboard () {

    const [data, setdata] = useState([]);
    const [otherAccs, setotherAccs] = useState();
    const [isLoading, setisLoading] = useState(false)
    const [method, setmethod] = useState('');
    const [totalBal, settotalBal] = useState(202.20);
    const [depAmount, setdepAmount] = useState(0);
    const [transAmount, settransAmount] = useState(0);
    const [transModal, settransModal] = useState(false)
    const [desData, setdesData] = useState("");
    const [activeAccNo, setactiveaccNo] = useState();
    const [targetaccNo, settargetaccNo] = useState();
    const modalType = useRef('');
    const [activeType, setactiveType] = useState('');
    const [activeTypeId, setactiveTypeId] = useState();
    const [accountTypes, setaccountTypes] = useState();
    const [createType, setcreateType] = useState();//work on this
    const [depOpen,setdepOpen] = useState(false)
    const [revOpen,setrevOpen] = useState(false)
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

    //get all account types
    const getacctypes =async ()=>{
        try{
            const types = await axios.get(`${URL.baseURL}${URL.API_URL}/accountType`);
            const refined = types.data.message;
            setaccountTypes(refined);
            setcreateType(refined[0]._id);
            console.log(refined)
        }catch(err){showError(err.message)}
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
        checkAccounts();
        getacctypes();
    },[errorOpen])

    //Opens Available Modals for deposit and withdraw
    const openModal = async (method,type,modalName,accNo,typeId)=>{
        modalType.current = type;
        setactiveType(modalType.current);
        setmethod(method);
        setactiveaccNo(accNo)
        setactiveTypeId(typeId);
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
        if (depAmount <= 0 || isNaN(depAmount)){
            showError(`Your ${method} amount is invalid`)
            return;
        }
        try{
            setisLoading(true)
            //send deposit to server
            const response = await axios.post(`${URL.baseURL}${URL.API_URL}/accounts/deposit`,{
                accNumber: activeAccNo,
                accTypeId: activeTypeId,
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
            setrevOpen(false);
            setisLoading(false)
        }catch(err){
            showError(err)
        }
    }

    //Reverse 
    const reverseFunc = async (amount,Type,accNo,typeId)=>{
        setdesData(`Reversal for ${Type}, Amout=${amount}`);
        setactiveType(Type);
        setactiveTypeId(typeId)
        setactiveaccNo(accNo);
        if (amount<0){
            setmethod('Deposit');
            setdepAmount(-amount);
        }else if(amount > 0){
            setmethod('Withdraw');
            setdepAmount(amount);
        }
        setrevOpen(true);
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
            console.log(createType)
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

    //Get all account except current
    const getseperateAccs=async (type, acNumber)=>{
        try{
            const response = await axios.get(`${URL.baseURL}${URL.API_URL}/accounts/getuserAccs/${userId}/${acNumber}`);
            setotherAccs(response.data.message)
        }catch(err){
            showError(err)
        }
        setactiveaccNo(acNumber);
        settransModal(true);
        setmethod('Transfer');
        setactiveType(type)
    }
    //transfer from one account to another
    const transferFunc = async()=>{
        try{
            if(targetaccNo == null || transAmount <= 0){
                showError('Invalid Entry');
                settransModal(false)
                return;
            }
            const response = await axios.post(`${URL.baseURL}${URL.API_URL}/accounts/accTransfer`,{
                accNumber : activeAccNo,
                amount : transAmount,
                userId : userId,
                targetAccNo : targetaccNo
            });
            if(response.data.Sucess==false){showError(response.data.message)}
            settransModal(false);
            checkAccounts()
        }catch(err){
            showError(err)
        }
    }
    
    return (
        <div className='screen'>
            <Header total={totalBal} add={()=>{setcreateOpen(true)}}/>
            <div className='content'>
                <div className='topContent'>
                    { hasAccount ? 
                        (
                            info.map((item,index)=>
                                <React.Fragment key={item._id}>
                                    <Card
                                        type={item.accTypeId.Name} 
                                        typeId={item.accTypeId}
                                        amount={item.Value} 
                                        account={item.accNumber} 
                                        func={openModal}   
                                        transfer={()=>{settransAmount(0);settargetaccNo(); getseperateAccs(item.accType,item.accNumber)}} 
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
                            {/* <option value="Current">Current Account</option>
                            <option value="Savings">Savings Account</option> */}
                            { accountTypes ? 
                                accountTypes.map((item)=>
                                    <option key={item._id} value={item.Name}>{item.Name}</option>
                                ) :"There are no account types"} 
                        </select>
                    </div>
                    <div className='lowerBttm'>
                        <table>
                            <thead>
                                <tr>
                                    <th>date</th>
                                    <th>description</th>
                                    <th>account</th>
                                    <th>balance</th>
                                    <th>ammount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.filter(item => selectVal==='All' || item.accTypeId.Name=== selectVal).map((info)=>
                                <tr key={info._id} style={{position:'relative'}}>
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
                                    <td style={{color:'rgba(0, 72, 255, 1)'}}>{info.accTypeId.Name}</td>
                                    <td style={{color:'rgb(3, 154, 13)'}}>{info.balance}</td>
                                    <td>{info.Value}</td><button style={{position:'absolute', right:13,top:7}} onClick={()=>{reverseFunc(info.Value,info.accTypeId.Name,info.accNumber,info.accTypeId)}}><IoArrowUndoCircleOutline color='red' size={20} /></button>
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
                <Modal //modal for transfer btw Accounts
                    name="transferModal"
                    isOpen={transModal} 
                    onRequestClose={() => settransModal(false)} 
                    className={styles.modalContent} 
                    overlayClassName={styles.modalOverlay} 
                >
                        <h2>Transfer from {activeType} Account</h2>
                        {otherAccs ? otherAccs.map((info)=>
                            <button 
                            key={info._id}
                            style={{
                            width: 280, height: 40, borderRadius:5, cursor:'pointer', borderWidth:info.accNumber==targetaccNo ? 3 : 0, display:'flex', flexDirection:'row',
                            backgroundColor:'rgba(2, 48, 255, 0.47)', marginBottom: 10,justifyContent:'space-between', alignItems:'center',
                            borderColor:info.accNumber==targetaccNo ? 'orange' : 'white'
                            }}
                                onClick={()=>{info.accNumber!==targetaccNo ? settargetaccNo(info.accNumber) : settargetaccNo();}}
                            >
                                <div><span>{info.accNumber}</span></div>
                                <div style={{
                                    padding:5, backgroundColor:'rgba(255, 0, 0, 0.72)', borderRadius:5
                                }}><span style={{color:'white'}}>Gh¢ {info.Value}</span></div>
                        </button>
                        ) : ''}

                        <input type='number' min='0' step={.01} placeholder='Gh₵ (2 decimal place)' onChange={(val)=>settransAmount(Number(val.target.value))} />
                        
                        <button onClick={transferFunc} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
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
                            <select value={createType} onChange={(val)=>{setcreateType(val.target.value);console.log(val.target.value)}}>
                                {/* <option value="Current">Current Account</option>
                                <option value="Savings">Savings Account</option> */}
                                { accountTypes ? 
                                accountTypes.map((item)=>
                                    <option key={item._id} value={item._id}>{item.Name}</option>
                                ) :"There are no account types"} 
                            </select>   
                            <button onClick={createAccount}>Create account</button>
                        </div>
                </Modal>
                <Modal //modal for Reverse
                    name="reverseModal"
                    isOpen={revOpen} 
                    onRequestClose={() => setrevOpen(false)} 
                    className={styles.modalContent} 
                    overlayClassName={styles.modalOverlay} 
                >
                        <h2> Are you sure you want to reverse from {activeType} Account</h2>
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
                                <span>Yes</span>
                            }
                        </button>
                        <button onClick={()=>{setrevOpen(false)}}>No</button>
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