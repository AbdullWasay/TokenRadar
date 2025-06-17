// Window type declarations for Solana wallets

interface Window {
  solana?: {
    isPhantom?: boolean
    isConnected?: boolean
    publicKey?: {
      toString(): string
    }
    connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>
    disconnect(): Promise<void>
    signTransaction(transaction: any): Promise<any>
    signAllTransactions(transactions: any[]): Promise<any[]>
    request(method: string, params?: any): Promise<any>
  }
  
  solflare?: {
    isSolflare?: boolean
    isConnected?: boolean
    publicKey?: {
      toString(): string
    }
    connect(): Promise<{ publicKey: { toString(): string } }>
    disconnect(): Promise<void>
    signTransaction(transaction: any): Promise<any>
    signAllTransactions(transactions: any[]): Promise<any[]>
  }
}
