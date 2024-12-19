import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import AppNav from "@/components/nav";
import Button from 'react-bootstrap/Button';
import { AppSpinner } from "@/components/spinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function Home() {
  const [log, setLog] = useState(null)
  const [loading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  let logs = []

  const formatLog = (msg) => {
    try {
      const report = JSON.parse(msg)
      if (report.message) {
        return <span>{report.message}</span>
      } else if (report.report?.complete) {
        setIsLoading(false)
        return <span>Complete</span>
      } else {
        const j = report.report;
      let results = []
      for(let i = 0; i < j.tests.length; i++) {
        const passed = j.tests[i].state == 'passed'
        results.push(<li key={'t--'+ i} className={passed ? 'text-green' : 'text-red'}>{j.tests[i].title.join(' > ')}</li>)
      }
      return <ul>
        <li><h3>Tests {j.reporterStats.tests} Passes {j.reporterStats.passes} Failures {j.reporterStats.failures}</h3></li>
        {results}</ul>
      }
      
    } catch(e) {
      
    }
  }

  const addLog = (msg) => {
    logs.push(msg)
    let res = []
    for (let i = logs.length - 1; i > -1 ; i--) {
      res.push(<li key={i}>{formatLog(logs[i])}</li>)
    }
    setLog(res)
  }

  const handleSocket = (token = '') => {

    const socket = new WebSocket("ws://localhost:8765")

    // Connection opened
    socket.addEventListener("open", event => {
      const msg = `🚀 Requesting Cypress reports ... Date: ${new Date()}. token=${token}`
      socket.send(msg)
    });

    // Listen for messages
    socket.addEventListener("message", event => {
      addLog(event.data)
      setIsConnected(true)
      console.log("Message from server ", event.data)
    })

  }

  const connect = () => {
    Swal.fire({
      title: "Enter a token for a user to perform tests under",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      confirmButtonText: "Connect",
      showLoaderOnConfirm: true,
      preConfirm: async (token) => {
        try {
          setIsLoading(true)
          handleSocket(token)
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
     
    })
  }

  //list-inside list-decimal 

  useEffect(() => {
    
  }, [])

  return (
    <>
    <AppNav handleConnect={connect} isConnected={isConnected} />
      <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
  
      {loading && <AppSpinner />}
       
        <ul className="list-disc text-sm  sm:text-left font-[family-name:var(--font-geist-mono)]">
          {log}
         {!isConnected && <li className="mb-2">
            Click <Button variant="warning" onClick={connect}>Connect</Button> to establish a connection to
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              data.dev.sennetconsortium.org
            </code>
            .
          </li>}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://data.dev.sennetconsortium.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="World"
            width={16}
            height={16}
          />
          SenNet
        </a>
      </footer>
    </div>
    </>
  );
}
