import React, { useState } from 'react'
import './App.css'

function App() {
  const [countMap, setCountMap] = useState({})
  const [fileName, setFileName] = useState('')

  const handleDownload = () => {
    const resultText = generateResultText()
    if (window.electron) {
      window.electron.send('toMain', { content: resultText })

      window.electron.receive('fromMain', (response) => {
        const messageElement = document.getElementById('message')
        messageElement.textContent = response
      })
    } else {
      console.error('Electron is not defined')
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        countNumbers(text)
      }
      reader.readAsText(file)
    }
  }

  const countNumbers = (text) => {
    const numbers = text.match(/\d+/g) || []
    const counts = {}
    numbers.forEach((num) => {
      counts[num] = (counts[num] || 0) + 1
    })
    setCountMap(counts)
  }

  const generateResultText = () => {
    return Object.entries(countMap)
      .map(([number, count]) => `Number: ${number}, Count: ${count}`)
      .join('\n')
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='App'>
      <h1>Number Counter App</h1>
      <input type='file' accept='.txt' onChange={handleFileChange} style={{ marginBottom: '20px' }} />
      <p>Selected File: {fileName || 'None'}</p>
      <p id='message'></p>
      <div className='result'>
        <h2>Counts:</h2>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Number</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(countMap).map(([number, count]) => (
                <tr key={number}>
                  <td>{number}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Object.keys(countMap).length > 0 && <button onClick={handleDownload}>Download Result</button>}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        ↑ Back to Top
      </button>
    </div>
  )
}

export default App
