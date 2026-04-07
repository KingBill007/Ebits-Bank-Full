import { useEffect, useState } from "react";
import axios from 'axios';
import {URL} from '../data/URL';
import '../styles/main.css';

const DEFAULT_TIERS = [
  { id: 1, min: 1000, max: null, commission: 2, label: "Above 1,000" },
  { id: 2, min: 500, max: 999.99, commission: 1, label: "500 - 999.99" },
  { id: 3, min: 300, max: 499.99, commission: 0.5, label: "300 - 499.99" },
  { id: 4, min: 0, max: 299.99, commission: 0, label: "Below 300" },
];

const INITIAL_ACCOUNTS = [
  {
    id: 1,
    Name: "Savings Account",
    icon: "🏦",
    color: "#3b82f6",
    minWithdrawal: 100,
    tiers: DEFAULT_TIERS.map((t) => ({ ...t })),
    above1000:     2,
    from500to999:  1,
    from300to499:  0.5,
    below300:      0,
  },
  {
    id: 2,
    Name: "Current Account",
    icon: "🏦",
    color: "#0ea5e9",
    minWithdrawal: 50,
    tiers: DEFAULT_TIERS.map((t) => ({ ...t })),
    above1000:     2,
    from500to999:  1,
    from300to499:  0.5,
    below300:      0,
  },
];



function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,30,60,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)",
      animation: "fadeIn .18s ease"
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "min(560px, 96vw)",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(30,80,160,0.15)",
        animation: "slideUp .2s ease",
        border: "1.5px solid #e0edfa"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 28px 18px", borderBottom: "1.5px solid #e8f2fb"
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1a3a5c", fontFamily: "'DM Sans', sans-serif" }}>
            {title}
          </span>
          <button onClick={onClose} style={{
            background: "#f0f6ff", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16,
            color: "#5a7fa8", display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      background: color + "18", color: color,
      border: `1px solid ${color}30`, letterSpacing: 0.3
    }}>{children}</span>
  );
}

function TierRow({ label,value,target, onChange}) {
  return (
    <div 
    style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 80px",
      gap: 10, alignItems: "center", padding: "10px 14px",
      background: "#f5f9ff", borderRadius: 10, marginBottom: 8
    }}>
      <span style={{ fontSize: 13, color: "#4a6a8a", fontWeight: 500 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="number" min={0} step={0.5} //max={100} 
          value={value}
           onChange={(e) => onChange( target , parseFloat(e.target.value) || 0 )}
          style={{
            width: "100%", padding: "6px 10px", borderRadius: 8,
            border: "1.5px solid #c7ddf5", fontSize: 14,
            color: "#1a3a5c", outline: "none", background: "#fff"
          }}
        />
        <span style={{ fontSize: 13, color: "#7a9cbf", whiteSpace: "nowrap" }}>%</span>
      </div>
      <Badge color={value === 0 ? "#22c55e" : "#3b82f6"}>
        {value === 0 ? "Free" : `${value}%`}
      </Badge>
    </div>
  );
}

const control = [
  { key: 'above1000',    label: 'Above 1,000' },
  { key: 'from500to999', label: '500 - 999.99' },
  { key: 'from300to499', label: '300 - 499.99' },
  { key: 'below300',     label: 'Below 300' },
];
const colar = "#0ea5e9";
const ican = '🏦';

function AccountCard({ account, onEdit, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: hover ? `2px solid ${colar}` : "2px solid #e5eefb",
        boxShadow: hover ? `0 8px 32px ${colar}22` : "0 2px 12px rgba(60,100,180,0.07)",
        padding: "24px 26px",
        transition: "all .22s cubic-bezier(.4,0,.2,1)",
        position: "relative", overflow: "hidden",
        cursor: "default"
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${colar}, ${colar}88)`,
        borderRadius: "18px 18px 0 0"
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: colar + "18",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, border: `1.5px solid ${colar}30`
          }}>{ican}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3a5c", marginBottom: 3 }}>
              {account.Name}
            </div>
            <Badge color={colar}>Active</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {onEdit(account);console.log(account);}}
            style={{
              background: "#f0f6ff", border: "1.5px solid #c7ddf5",
              borderRadius: 9, padding: "7px 14px", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "#3b82f6",
              transition: "all .15s"
            }}
            onMouseEnter={e => { e.target.style.background = "#ddeeff"; }}
            onMouseLeave={e => { e.target.style.background = "#f0f6ff"; }}
          >Edit</button>
          <button
            onClick={() => onDelete(account.id)}
            style={{
              background: "#fff5f5", border: "1.5px solid #fdc5c5",
              borderRadius: 9, padding: "7px 14px", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "#e05252",
              transition: "all .15s"
            }}
            onMouseEnter={e => { e.target.style.background = "#ffe0e0"; }}
            onMouseLeave={e => { e.target.style.background = "#fff5f5"; }}
          >Delete</button>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 10, marginBottom: 16
      }}>
        <div style={{ background: "#f5f9ff", borderRadius: 11, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#7a9cbf", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 4 }}>Min Withdrawal</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a3a5c" }}>
            ${account.minWithdrawal.toLocaleString()}
          </div>
        </div>
        <div style={{ background: "#f5f9ff", borderRadius: 11, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#7a9cbf", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 4 }}>Commission Tiers</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a3a5c" }}>
            {control.length} tiers
          </div>
        </div>
      </div>

      {/* Tier summary */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {control.map(({ key, label }) => (
          <span key={key} style={{
            background: account[key] === 0 ? "#f0fdf4" : "#eff6ff",
            color: account[key] === 0 ? "#16a34a" : "#2563eb",
            border: `1px solid ${account[key] === 0 ? "#bbf7d0" : "#bfdbfe"}`,
            borderRadius: 7, fontSize: 11, padding: "3px 9px", fontWeight: 600
          }}>
            {label}: {account[key]}%
          </span>
        ))}
        
      </div>
    </div>
  );
}

function AccountFormModal({ account, onSave, onClose }) {
  const [form, setForm] = useState(
    account
      // ? { ...account, tiers: account.tiers.map(t => ({ ...t })) }
      // : {
      //     id: Date.now(),
      //     Name: "",
      //     icon: "🏦",
      //     color: "#3b82f6",
      //     minWithdrawal: 20,
      //     tiers: DEFAULT_TIERS.map(t => ({ ...t })),
      //   }
  );
  
  //chnages the values of the form on text change
  const handleTierChange = async (target,value) => {
     setForm(f => ({
       ...f,
       [target]: value
     }));
  };

  const isValid = form.Name.trim() && form.minWithdrawal >= 0;

  return (
    <Modal title={account ? `Edit — ${account.Name}` : "Add New Account Type"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Name */}
        <div>
          <label style={labelStyle}>Account Name</label>
          <input
            value={form.Name}
            onChange={e => setForm(f => ({ ...f, Name: e.target.value }))}
            placeholder="e.g. Fixed Deposit"
            style={inputStyle}
          />
        </div>



        {/* Min Withdrawal */}
        <div>
          <label style={labelStyle}>Minimum Withdrawal Amount ($)</label>
          <input
            type="number" min={0}
            value={form.minWithdrawal}
            onChange={e => setForm(f => ({ ...f, minWithdrawal: parseFloat(e.target.value) || 0 }))}
            style={inputStyle}
          />
        </div>

        {/* Commission Tiers */}
        <div>
          <label style={{ ...labelStyle, marginBottom: 10, display: "block" }}>
            Withdrawal Commission Tiers
          </label>
          {/* {form.tiers.map(t => (
            <TierRow key={t.id} tier={t} onChange={handleTierChange} />
          ))} */}
          <TierRow label={'Below 300'} value={form.below300} onChange={handleTierChange} target={'below300'}/>
          <TierRow label={'300 - 499.99'} value={form.from300to499} onChange={handleTierChange} target={'from300to499'} />
          <TierRow label={'500 - 999.99'} value={form.from500to999} onChange={handleTierChange} target={'from500to999'} />
          <TierRow label={'Above 100'} value={form.above1000} onChange={handleTierChange} target={'above1000'} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
          <button
            onClick={() => isValid && onSave(form)}
            disabled={!isValid}
            style={{
              ...primaryBtnStyle,
              opacity: isValid ? 1 : 0.5,
              cursor: isValid ? "pointer" : "not-allowed"
            }}
          >
            {account ? "Save Changes" : "Create Account"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirm Deletion" onClose={onClose}>
      <p style={{ color: "#4a6a8a", fontSize: 15, marginBottom: 24 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
        <button onClick={onConfirm} style={{
          background: "#ef4444", color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 22px", cursor: "pointer",
          fontWeight: 700, fontSize: 14
        }}>Delete</button>
      </div>
    </Modal>
  );
}

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700, color: "#5a7fa8",
  textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 7
};
const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #c7ddf5", fontSize: 15, color: "#1a3a5c",
  outline: "none", background: "#f8fbff", boxSizing: "border-box",
  transition: "border .15s"
};
const primaryBtnStyle = {
  background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
  color: "#fff", border: "none", borderRadius: 10,
  padding: "10px 24px", fontWeight: 700, fontSize: 14,
  cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.3)"
};
const secondaryBtnStyle = {
  background: "#f0f6ff", color: "#3b82f6",
  border: "1.5px solid #c7ddf5", borderRadius: 10,
  padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer"
};

export default function Admin() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [showForm, setShowForm] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [allaccounts, setallaccounts] = useState();


  

  //ERROR display function
  const [errorOpen, seterrorOpen] = useState(false);
  const [errorMsg,seterrorMsg] = useState('Error');
  const showError = (message)=>{
      seterrorMsg("Error: "+message);
      seterrorOpen(true);
  }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const handleSave = async(form) => {
    if (editAccount) {
      setAccounts(a => a.map(ac => ac.id === form.id ? form : ac));
      showToast("Account updated successfully.");
    } else {
      setAccounts(a => [...a, form]);
      try{
        const payload = {
        Name: form.Name,
        minWithdrawal: form.minWithdrawal,
        above1000:     form.tiers.find(t => t.id === 1)?.commission ?? 0,
        from500to999:  form.tiers.find(t => t.id === 2)?.commission ?? 0,
        from300to499:  form.tiers.find(t => t.id === 3)?.commission ?? 0,
        below300:      form.tiers.find(t => t.id === 4)?.commission ?? 0,
      };
        const addacc = await axios.post(`${URL.baseURL}${URL.API_URL}/accountType/addnew`,payload);
        console.log(addacc.data)
        showToast("Account created successfully.");
      }catch(err){showError(err)}
    }
    setShowForm(false);
    setEditAccount(null);
  };
  const handleDelete = (id) => {
    setAccounts(a => a.filter(ac => ac.id !== id));
    setDeleteId(null);
    showToast("Account type deleted.", "error");
  };
  const handleEdit = (account) => {
    setEditAccount(account);
    setShowForm(true);
    
  };
  const getallacctypes=async()=>{
    try{
      const response = await axios.get(`${URL.baseURL}${URL.API_URL}/accountType`);
      setallaccounts(response.data.message)
      console.log(response.data.message);
    }catch(err){showError(err)}
  }
  useEffect(()=>{
    getallacctypes()
  },[])

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #e8f4fd 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes toastIn { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        * { box-sizing: border-box; }
        input:focus { border-color: #3b82f6 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f6ff; }
        ::-webkit-scrollbar-thumb { background: #b8d4f0; border-radius: 99px; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1.5px solid #ddeeff",
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 40px"
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 68
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
            }}>🏛</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a3a5c", lineHeight: 1.1 }}>
                Ebits Bank
              </div>
              <div style={{ fontSize: 11, color: "#7a9cbf", fontWeight: 500, letterSpacing: 0.5 }}>
                Admin Console
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 13, color: "#7a9cbf" }}>
              <span style={{ color: "#1a3a5c", fontWeight: 600 }}>Admin</span> · Account Manager
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14
            }}>A</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page Title */}
        <div style={{ marginBottom: 36, animation: "slideUp .3s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 30, fontWeight: 700, color: "#1a3a5c",
                margin: "0 0 6px"
              }}>Account Types</h1>
              <p style={{ color: "#7a9cbf", fontSize: 14, margin: 0 }}>
                Manage savings & current account parameters, withdrawal limits, and commission tiers.
              </p>
            </div>
            <button
              onClick={() => { setEditAccount(null); setShowForm(true); }}
              style={{
                ...primaryBtnStyle,
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 22px", fontSize: 14
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              Add Account Type
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, marginBottom: 32, animation: "slideUp .35s ease"
        }}>
          {[
            { label: "Total Account Types", value: accounts.length, icon: "🏦" },
            { label: "Avg Min Withdrawal", value: `$${accounts.length ? Math.round(accounts.reduce((s, a) => s + a.minWithdrawal, 0) / accounts.length) : 0}`, icon: "💸" },
            { label: "Commission Tiers", value: accounts.length ? accounts[0].tiers.length : 0, icon: "📊" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "18px 22px",
              border: "1.5px solid #e5eefb",
              boxShadow: "0 2px 10px rgba(60,100,180,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7a9cbf", textTransform: "uppercase", letterSpacing: 0.7 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1a3a5c" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        {accounts.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "#fff", borderRadius: 18, border: "2px dashed #c7ddf5"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏦</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a3a5c", marginBottom: 8 }}>
              No Account Types Yet
            </div>
            <p style={{ color: "#7a9cbf", marginBottom: 24 }}>
              Get started by adding your first account type.
            </p>
            <button onClick={() => { setEditAccount(null); setShowForm(true); }} style={primaryBtnStyle}>
              + Add Account Type
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))",
            gap: 20, animation: "slideUp .4s ease"
          }}>
            {allaccounts ?  allaccounts.map(ac => (
              <AccountCard
                key={ac.id}
                account={ac}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            )) : ''}
          </div>
        )}
      </main>



      {/* Modals */}
      {showForm && (
        <AccountFormModal
          account={editAccount}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditAccount(null); }}
        />
      )}
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this account type? This action cannot be undone."
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28,
          background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1.5px solid ${toast.type === "error" ? "#fca5a5" : "#86efac"}`,
          color: toast.type === "error" ? "#dc2626" : "#16a34a",
          borderRadius: 12, padding: "12px 20px",
          fontWeight: 600, fontSize: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          animation: "toastIn .25s ease",
          display: "flex", alignItems: "center", gap: 8, zIndex: 9999
        }}>
          <span>{toast.type === "error" ? "🗑" : "✅"}</span>
          {toast.msg}
        </div>
      )}
      {/* <Modal //modal for ERROR!!!
          name="errorModal"
          isOpen={errorOpen} 
          onRequestClose={() => seterrorOpen(false)} 
          className='errorContent' 
          overlayClassName='errorOverlay'
          closeTimeoutMS={300}   // wait 300ms before unmounting
      >
          {errorMsg}
      </Modal> */}
    </div>
  );
}