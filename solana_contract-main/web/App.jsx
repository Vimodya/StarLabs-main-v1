// Main App Component
import React from 'react';
import WalletContextProvider from './wallet-provider';
import TokenSwap from './swap-component';

function App() {
    return (
        <WalletContextProvider>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <TokenSwap />
                </div>
            </div>
        </WalletContextProvider>
    );
}

export default App;
