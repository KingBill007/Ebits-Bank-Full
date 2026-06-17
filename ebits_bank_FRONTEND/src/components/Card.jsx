import { CiWallet } from "react-icons/ci";
import styles from "../styles/card.module.css";
import { PiHandDepositFill } from "react-icons/pi";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { useState } from "react";

function Card (props){
  
    const [maskedNo, setmaskedNo] = useState(true)

    function maskAccountNumber(accNumber) {
      const str = accNumber.toString();
      const visibleDigits = 4;
      const maskedLength = str.length - visibleDigits;
      const masked = '*'.repeat(maskedLength) + str.slice(-visibleDigits);
      return `${masked}`;
    }

    function changeMask(){
      if (maskedNo){
        setmaskedNo(false)
      } else { setmaskedNo(true)}
    }

    return (
      <div className={styles.card}>
        <div className={styles.left}>
          <span className={styles.typeLabel}>{props.type} Account</span>
          <span className={styles.amount}>GH₵ {props.amount.toFixed(2)}</span>
          <span className={styles.accNumber} onClick={changeMask}>Account {maskedNo ? maskAccountNumber(props.account) : props.account}</span>
          <div className={styles.btnBox}>
            <button className={styles.bttnBlue} onClick={()=>{props.func('Deposit',props.type,'depositModal',props.account,props.typeId)}} ><PiHandDepositFill />Deposit</button>
            <button className={styles.bttnWhite} onClick={()=>{props.func('Withdraw',props.type,'depositModal',props.account,props.typeId)}}><PiHandWithdrawFill />Withdraw</button>
          </div>
          <div className={styles.actions}>
            {/* <span className={styles.typeBadge}>{props.type}</span> */}
            <button className={styles.iconBtn} onClick={props.transfer}><FaMoneyBillTransfer color="#dc3545" size={22} /></button>
            <button className={styles.iconBtn} onClick={()=>props.history(props.typeId._id)}><FaHistory color="#718096" size={20} /></button>
          </div>
        </div>
        <div className={styles.right}> 
          <CiWallet size={90} color="rgba(62, 117, 255, 0.5)"/>
        </div>
      </div>
    );
}
export default Card