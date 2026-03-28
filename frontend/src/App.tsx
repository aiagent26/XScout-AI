import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';

import './index.css';
import Guide from './Guide';
import { getT } from './i18n';
import type { Language } from './i18n';

type LogType = 'system' | 'bull' | 'bear' | 'judge' | 'security';

interface LogMessage {
  id: number;
  type: LogType;
  text: string;
}

function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = getT(lang);

  const [currentView, setCurrentView] = useState<'terminal' | 'guide'>('terminal');
  const [prompt, setPrompt] = useState(t.leftPanel.p1Val);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [x402Fee, setx402Fee] = useState(0.00);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramUid, setTelegramUid] = useState('');
  const [telegramNickname, setTelegramNickname] = useState('');
  const [telegramInput, setTelegramInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Update prompt default if language changes
  useEffect(() => {
    if (!prompt) setPrompt(t.leftPanel.p1Val);
  }, [lang]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: LogType, text: string) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), type, text }]);
  };

  const handleWalletClick = async () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress('');
    } else {
      setIsConnecting(true);
      try {
        if ((window as any).ethereum) {
          // Kết nối thẳng tới Extension Metamask / OKX Wallet của User bằng Ethers v6
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
          }
        } else {
          alert("PLEASE INSTALL METAMASK OR OKX WEB3 WALLET EXTENSION TO PROCEED!");
        }
      } catch (error) {
        console.error("Wallet Connection Failed:", error);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleDeposit = async () => {
    if (!walletConnected || !(window as any).ethereum) {
      alert("Please connect your wallet first!");
      return;
    }
    
    setIsExecuting(true);
    setLogs([]);
    addLog('system', "Awaiting User Metamask Signature to Deposit 0.0001 OKB/ETH into Vault...");
    
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Gửi tiền thật vào Smart Contract Két sắt trên X Layer (Bản V2 Mới Nhất)
      const vaultAddress = "0x379BF1f5fCfdc39d485ef81e39c8c6f63231eec5";
      
      const tx = await signer.sendTransaction({
        to: vaultAddress,
        value: ethers.parseEther("0.0001")
      });
      
      addLog('system', `[Vault Deposit] Broadcasting Transaction to Mempool: ${tx.hash}`);
      await tx.wait(); // Chờ Mạng lưới xác nhận Block
      
      addLog('security', "✅ FUNDING CONFIRMED: 0.0001 OKB successfully Delegated to Agentic Smart Contract Vault constraints!");
    } catch (e: any) {
      addLog('system', `[Vault Deposit] User Canceled or Transaction Failed: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTelegramSync = async () => {
    if (/^\d+$/.test(telegramInput.trim()) && telegramInput.trim().length >= 6) {
      setIsExecuting(true);
      setLogs([]);
      setTimeout(() => addLog('system', t.rightPanel.logs.init), 500);
      
      const uid = telegramInput.trim();
      let nickname = `@agent_${uid.slice(-4)}`;
      
      try {
        // Truy vấn trực tiếp API Telegram để lấy tên thật / Username thật của người dùng
        const res = await fetch(`https://api.telegram.org/bot8782510741:AAF2WquEq8nfra-azsHbBFk0nN8Ot5o8hzU/getChat?chat_id=${uid}`);
        const data = await res.json();
        if (data.ok && data.result) {
          nickname = data.result.username ? `@${data.result.username}` : data.result.first_name;
        }
      } catch(e) {
        console.error("Lỗi getChat Telegram", e);
      }

      setTimeout(() => {
        addLog('system', `${t.rightPanel.logs.syncSuccess} [${uid}] (${nickname})`);
        addLog('system', t.rightPanel.logs.syncSub);
        setTelegramUid(uid);
        setTelegramNickname(nickname);
        setTelegramInput('');
        setIsExecuting(false);
      }, 1500);
    } else {
      alert("Vui lòng nhập Telegram UID hợp lệ (chỉ bao gồm số). / Please enter a valid Telegram ID.");
    }
  };

  const handleAction = async () => {
    if (!walletConnected) {
      alert("⚠️ PLEASE CONNECT OKX WEB3 WALLET TO AUTHORIZE x402 INFERENCE FEES.");
      return;
    }
    if (!prompt) return;
    simulateExecution();
  };

  const simulateExecution = async () => {
    if (!prompt) return;
    setIsExecuting(true);
    setLogs([]);
    setx402Fee(0);

    setTimeout(() => addLog('system', "Initializing Decentralized HTTP Relay... Bypassing Mocks. Opening Pipeline to TEE Node."), 300);
    setTimeout(() => addLog('security', "Guards Injecting Live Market Metadata via OKX Trade API Router. Awaiting Deep-Thinking LLM Debates... (This usually takes 8-15 seconds)"), 1000);

    try {
      // 🚀 PRODUCTION ARCHITECTURE V2: Relative API Pathing (Bypasses Browser CORS / HTTPS Mixed Content Lockout)
      const apiUrl = `/api/trade`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });
      
      const realData = await response.json();
      
      if(realData.success) {
        // Nạp Dữ liệu Thật sự của AI Mua / Bán
        addLog('bull', `BULL ARGUMENT:\n${realData.debate.bullArgument}`);
        setx402Fee(0.01);
        
        setTimeout(() => {
           addLog('bear', `BEAR AUDITOR REBUTTAL:\n${realData.debate.bearArgument}`);
           setx402Fee(0.02);
        }, 1200);

        setTimeout(() => {
           addLog('judge', `JUDGE DECISION MATRIX:\n${JSON.stringify(realData.debate.finalDecision, null, 2)}`);
           setx402Fee(0.03);
        }, 3000);

        setTimeout(() => {
           addLog('system', `EXECUTION VERDICT (TEE Onchain System):\nStatus: ${realData.status}\nBlock Hash Receipt: ${realData.txHash}`);
           setIsExecuting(false);
        }, 4500);
      } else {
        addLog('system', `SYSTEM FAILURE! API Gateway Crumbled: ${realData.error}`);
        setIsExecuting(false);
      }
    } catch (e: any) {
       addLog('system', `CRITICAL NETWORK ERROR. Is the PM2 Backend API Server running on port 3001? Detail: ${e}`);
       setIsExecuting(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="top-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <h1 className="brand-title" style={{fontSize: '1.2rem', margin: 0}}>
             <span className="status-dot"></span> XScout AI
          </h1>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            style={{
              background: 'rgba(0, 240, 255, 0.1)', 
              color: 'var(--accent-blue)', 
              border: '1px solid var(--accent-blue)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Outfit',
              outline: 'none'
            }}
          >
            <option value="en">🌐 English (EN)</option>
            <option value="zh">🌐 简体中文 (ZH)</option>
          </select>
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab ${currentView === 'terminal' ? 'active' : ''}`} onClick={() => setCurrentView('terminal')}>{t.nav.terminal}</button>
          <button className={`nav-tab ${currentView === 'guide' ? 'active' : ''}`} onClick={() => setCurrentView('guide')}>{t.nav.guide}</button>
        </div>
      </div>
      
      {currentView === 'terminal' ? (
        <div className="command-center">
      <div className="glass-panel left-panel">
        <div>
          <div className="panel-header">
            <div className="subtitle">{t.leftPanel.subtitle}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="bws-btn" onClick={handleWalletClick} disabled={isConnecting} style={{ background: walletConnected ? 'rgba(0, 255, 136, 0.1)' : '', borderColor: walletConnected ? 'var(--accent-green)' : '' }}>
               {isConnecting ? '⏳ Waiting for Signature...' : (walletConnected ? `✅ ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)} (Disconnect)` : t.leftPanel.connectWallet)}
            </button>
            
            {walletConnected && (
              <button 
                className="bws-btn" 
                onClick={handleDeposit} 
                disabled={isExecuting}
                style={{ background: 'rgba(255, 153, 0, 0.1)', borderColor: '#ff9900', color: '#ff9900', fontSize: '0.85rem' }}
              >
                💰 Deposit 0.0001 OKB (Delegate to Vault)
              </button>
            )}
          </div>

          <div className="input-section">
            <label style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{t.leftPanel.inputLabel}</label>
            <textarea 
              className="input-area"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.leftPanel.inputPlaceholder}
              disabled={isExecuting}
            />
            <div className="prompts-list">
              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{t.leftPanel.smartPromptsLabel}</span>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px'}}>
                <button className="prompt-chip" onClick={() => setPrompt(t.leftPanel.p3Val)}>
                  {t.leftPanel.prompt3}
                </button>
                <button className="prompt-chip" onClick={() => setPrompt(t.leftPanel.p2Val)}>
                  {t.leftPanel.prompt2}
                </button>
                <button className="prompt-chip" onClick={() => setPrompt(t.leftPanel.p1Val)}>
                  {t.leftPanel.prompt1}
                </button>
              </div>
            </div>
          </div>

          <div className="billing-widget">
            <div className="billing-title">
              <span>{t.leftPanel.billingTitle}</span>
              <span style={{color: 'var(--accent-green)'}}>● Live</span>
            </div>
            <div className="billing-amount">
              ${x402Fee.toFixed(2)} <span>USDC</span>
            </div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4}}>
              {t.leftPanel.billingSub}
            </div>
          </div>

          <div className="telegram-widget">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                <span style={{fontSize: '1.2rem'}}>✈️</span> 
                <strong>{t.leftPanel.telegramTitle.replace('✈️', '')}</strong>
              </span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={telegramEnabled} 
                  onChange={(e) => {
                    if (!walletConnected && e.target.checked) {
                      alert(lang === 'zh' ? "⚠️ 请先连接 OKX Web3 钱包以防止垃圾邮件滥用！" : "⚠️ Please connect your OKX Web3 Wallet first to prevent spam!");
                      return;
                    }
                    setTelegramEnabled(e.target.checked);
                  }} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6}}>
              {telegramEnabled ? (
                telegramUid ? (
                  <span style={{color: 'var(--accent-green)'}}>{t.leftPanel.telegramSynced} {telegramUid} ({telegramNickname})</span>
                ) : (
                  <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                    <input 
                      type="text" 
                      value={telegramInput} 
                      onChange={(e) => setTelegramInput(e.target.value)} 
                      placeholder="UID..." 
                      style={{ flex: 1, padding: '6px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-border)', color: 'white' }}
                    />
                    <button onClick={handleTelegramSync} style={{ padding: '6px 12px', background: 'var(--accent-blue)', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sync</button>
                  </div>
                )
              ) : (
                <span style={{opacity: 0.6}}>*Push Alerts Disabled.</span>
              )}
            </div>
          </div>
        </div>

        <button 
          className="execute-btn" 
          onClick={handleAction}
          disabled={isExecuting || !prompt || !walletConnected}
          style={{ opacity: (!walletConnected || !prompt) ? 0.5 : 1, cursor: (!walletConnected || !prompt) ? 'not-allowed' : 'pointer' }}
        >
          {!walletConnected ? '🔒 CONNECT WALLET TO UNLOCK' : (isExecuting ? t.leftPanel.btnExecuting : t.leftPanel.btnExecute)}
        </button>
      </div>

      {/* Right Panel */}
      <div className="glass-panel right-panel">
        <div className="panel-title">
          <span>{t.rightPanel.title}</span>
          <span className="network-badge">{t.rightPanel.network}</span>
        </div>
        
        <div className="debate-terminal" ref={terminalRef}>
          {logs.length === 0 && !isExecuting && (
            <div style={{color: 'var(--text-secondary)', textAlign: 'center', marginTop: '100px'}}>
              {t.rightPanel.emptyState}
            </div>
          )}
          
          {logs.map(log => (
            <div key={log.id} className={`log-entry log-${log.type}`}>
              {log.type === 'system' && <span className="agent-name">{t.rightPanel.system}</span>}
              {log.type === 'security' && <span className="agent-name">{t.rightPanel.security}</span>}
              {log.type === 'bull' && <span className="agent-name">{t.rightPanel.bull}</span>}
              {log.type === 'bear' && <span className="agent-name">{t.rightPanel.bear}</span>}
              {log.type === 'judge' && <span className="agent-name">{t.rightPanel.judge}</span>}
              <div style={{ whiteSpace: 'pre-wrap' }}>{log.text}</div>
            </div>
          ))}

          {isExecuting && (
            <div className="log-entry log-system" style={{opacity: 0.7}}>
              <span className="agent-name"><span className="spinner"></span> {t.rightPanel.waiting}</span>
            </div>
          )}
        </div>
      </div>
    </div>
      ) : (
        <div className="guide-wrapper">
          <Guide onNavigate={setCurrentView} lang={lang} />
        </div>
      )}
    </div>
  );
}

export default App;
