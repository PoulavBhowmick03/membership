"use client"
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export default function Navbar() {
  const { active, account, activate, deactivate } = useWeb3React();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/">
                <a className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 dark:text-gray-100 text-lg">Club Membership</span>
                </a>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard">
                <a className="py-4 px-2 text-gray-500 dark:text-gray-100 hover:text-blue-500 transition duration-300">Dashboard</a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {active ? (
              <button
                onClick={disconnect}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300"
              >
                Disconnect: {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </button>
            ) : (
              <button
                onClick={connect}
                className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
              >
                Connect Wallet
              </button>
            )}
            {mounted && (
              <button
                aria-label="Toggle Dark Mode"
                type="button"
                className="w-10 h-10 p-3 rounded focus:outline-none"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
