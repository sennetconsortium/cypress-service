import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import AppNav from "@/components/nav";
import Button from 'react-bootstrap/Button';
import AppSpinner from "@/components/spinner";
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Footer from "@/components/footer";

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
  const [token, setToken] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [cliOps, setCliOps] = useState('')
  let logs = []

  const formatLog = (msg) => {
    try {
      const report = JSON.parse(msg)
      if (report.message) {
        return <Alert>{report.message}</Alert>
      } else if (report.report?.complete) {
        setIsLoading(false)
        return <Alert variant={"success"}><span className="fs-6">Complete</span></Alert>
      } else {
        const j = report.report;
      let results = []
      for(let i = 0; i < j.tests.length; i++) {
        const passed = j.tests[i].state == 'passed'
        results.push(<ListGroup.Item key={'t--'+ i} variant={passed ? 'success' : 'danger'}>{j.tests[i].title.join(' > ')}</ListGroup.Item>)
      }
      return <ListGroup variant="flush">
        <ListGroup.Item><h6 className="mt-2">Tests {j.reporterStats.tests} Passes {j.reporterStats.passes} Failures {j.reporterStats.failures}</h6></ListGroup.Item>
        {results}</ListGroup>
      }
      
    } catch(e) {
      console.error(e)
    }
  }

  const addLog = (msg) => {
    logs.push(msg)
    let res = []
    for (let i = logs.length - 1; i > -1 ; i--) {
      res.push(<ListGroup.Item key={i}>{formatLog(logs[i])}</ListGroup.Item>)
    }
    setLog(res)
  }

  const handleSocket = (auth) => {

    const socket = new WebSocket("ws://localhost:8765")

    // Connection opened
    socket.addEventListener("open", event => {
      const msg = `🚀 Requesting Cypress reports ... Date: ${new Date()}.\n params=${btoa(JSON.stringify(auth))}`
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
      title: "Authenticate with a display name and token.",
      html:
      `<form id="auth-form" class="text-left">
        <label class="form-label" required for="display_name">User Display Name<span class="text-red">*</span></label>
        <input id="display_name" required class="form-control mb-3" placeholder="required@domain.ext" value="${displayName}">
        <label class="form-label" for="token">Token<span class="text-red">*</span></label>
        <textarea id="token" required class="form-control mb-3">${token}</textarea>
        <input id="options" class="form-control mb-1" placeholder="Cli options" value="${cliOps}">
        <small class="text-muted">You may run a specific spec file. Example: <br> <code>-- --spec "cypress/e2e/provenance/page.cy.js"</code></small>
      </form>`,
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      confirmButtonText: "Connect",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const tok = document.getElementById("token").value
          const name = $document.getElementById("display_name").value
          const ops = document.getElementById("options").value
          if (!tok.length || !name.length) {
            document.getElementById('auth-form').classList.add('was-validated')
            throw new Error('One or more required fields are empty');
          }
          setIsLoading(true)
          setToken(tok)
          setDisplayName(name)
          setCliOps(ops)
          handleSocket({token: tok, display_name: name, options: ops})
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

  useEffect(() => {}, [])

  return (
    <>
    <AppNav handleConnect={connect} isConnected={isConnected} />
      <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
  
      {loading && <AppSpinner />}
       
      <ListGroup as="ul" className="text-sm sm:text-left font-[family-name:var(--font-geist-mono)]">
          {log}
         {!isConnected && <ListGroup.Item className="mb-2">
            Click <Button variant="warning" onClick={connect}>Connect</Button> to establish a connection to
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              data.dev.sennetconsortium.org
            </code>
            .
          </ListGroup.Item>}
        </ListGroup>
      </main>
     <Footer />
    </div>
    </>
  );
}
