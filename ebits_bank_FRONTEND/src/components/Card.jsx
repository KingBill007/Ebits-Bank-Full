import { CiWallet } from "react-icons/ci";
import { LuPiggyBank } from "react-icons/lu";
import styles from "../styles/card.module.css";
import { PiHandDepositFill } from "react-icons/pi";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";

function Card (props){
      function maskAccountNumber(accNumber) {
      const str = accNumber.toString();          // ensure it's a string
      const visibleDigits = 4;                   // how many digits to show at end
      const maskedLength = str.length - visibleDigits;
      const masked = '*'.repeat(maskedLength) + str.slice(-visibleDigits);
      return `${masked}`;
    }

    return (
      <div className="accountCard">
        <div className="accountCardLeft">
          <span style={{ fontWeight: "bold" }}>{props.type} Account</span>
          <span style={{ fontSize: 28, fontWeight: "bold", color:'rgba(1, 45, 156, 1)' }}>{props.amount.toFixed(2)}</span>
          <span style={{ fontSize: 13 }}>Account {maskAccountNumber(props.account)}</span>
          <div className={styles.btnBox}>
            <button className={styles.bttnBlue} onClick={()=>{props.func('Deposit',props.type,'depositModal',props.account,props.typeId)}} ><PiHandDepositFill />Deposit</button>
            <button className={styles.bttnWhite} onClick={()=>{props.func('Withdraw',props.type,'depositModal',props.account,props.typeId)}}><PiHandWithdrawFill />Withdraw</button>
          </div>
          <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:10}}>
            <button className="blueBttn">{props.type}</button>
            <button style={{backgroundColor:'transparent',borderWidth:0,cursor:'pointer'}} onClick={props.transfer}><FaMoneyBillTransfer color="red" size={30} /></button>
          </div>
        </div>
        <div className="accountCardRight"> 
          <CiWallet size={100} color="rgba(62, 117, 255, 0.71)"/>
          {/* {props.type==='Current' ? <CiWallet size={100} color="rgba(62, 117, 255, 0.71)"/> : <LuPiggyBank size={92} color='rgba(62, 117, 255, 0.71)' />} */}
        </div>
      </div>
    );
}
export default Card