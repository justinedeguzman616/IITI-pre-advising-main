import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iitiLOGO from '../navbar/navbarLOGO/iitiLogo.png'   

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    setLoading(true)
    try {
      const res = await fetch('/bridge/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        // Try to parse backend error message (if any)
        let errMsg = `Server responded with status ${res.status}`
        try {
          const errData = await res.json()
          if (errData && errData.error) errMsg = errData.error
        } catch (e) {
          // non-JSON response
        }
        alert(errMsg || 'Hindi ma-connect sa server, subukan ulit')
        return
      }

      // Parse JSON safely
      let data = null
      try {
        data = await res.json()
      } catch (e) {
        console.error('Failed to parse JSON from /bridge/login', e)
        alert('Maling tugon mula sa server, subukan ulit')
        return
      }

      if (data && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        const msg = (data && (data.error || data.message)) || 'Invalid credentials'
        alert(msg)
      }
    } catch (err) {
      console.error('Login request failed', err)
      alert('Hindi ma-connect sa server, subukan ulit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen font-RB bg-[#3B8126] px-4 py-8'>
        
        <div 
            className='bg-white rounded-2xl shadow-xl w-86.75 h-149.5 overflow-hidden'
        >
              
            <div>

                {/* IITI Logo */}
                <div className="flex justify-center p-8 ">
                  <img 
                    src={iitiLOGO} 
                    alt="IITI Logo" 
                    className=" bg-white rounded-full w-33.75 h-33.75 " 
                  />
                </div>

                {/* IITI title */}
                <div>
                    <h1 className='font-RB font-semibold text-center'>
                      Institute of Information
                      <br />Technology and Innovation
                    </h1>
                </div>

                {/*Log In Form*/}
                <div>
                    <form onSubmit={handleSubmit}
                        className='flex flex-col justify-center items-center space-y-5 pt-15'>
                        {/*username*/}
                        <input  type="text" id="username" name="username" required
                                className='border border-[#0E5A1280] rounded-full
                                           h-10.75 w-full max-w-[320px] p-4 
                                           focus:outline-none focus:ring-2 focus:ring-green-400
                                           placeholder:text-xs text-black/45
                                           cursor-pointer active:scale-95' 
                                placeholder='Username'/>

                        <input  type="password" id="password" name="password" required
                                className='border border-[#0E5A1280] rounded-full
                                           h-10.75 w-full max-w-[320px] p-4 
                                           focus:outline-none focus:ring-2 focus:ring-green-400
                                           placeholder:text-xs text-black/45
                                           cursor-pointer active:scale-95' 
                                placeholder='Password'/>

                        {/*Login Button */}
                        <div>

                            <button
                              type="submit"
                              disabled={loading}
                              aria-busy={loading}
                              className=" bg-[#1C6100] rounded-full w-72.5 h-10.75 cursor-pointer active:scale-95 disabled:opacity-60"
                            >
                              <h1 className="font-bold text-white">
                                {loading ? 'LOADING...' : 'LOG IN'}
                              </h1>
                            </button>

                        </div>

                    </form>
                </div>
            </div>


        </div>

    </div>
  )
}

export default Login