// import { useState,useMemo,useEffect } from 'react'
// import './App.css'
// import {io} from 'socket.io-client'


// function App() {
//   const [message, setMessage] = useState(0)
//   const [inputvalue, setInputValue] = useState([]);
  
//   const [userID ,setUserID]=useState('')
 


// const socket = useMemo(() => io('http://localhost:3002/'), []);
// //let socket =io("http://localhost:3002/")



// useEffect(()=>{

//   // I am accepting in orgument socket it will be the undefined error

//   // socket.on('connect',(socket)=>{
//   //   console.log("connected new user",socket.id)
//   // })

//   socket.on('connect', () => {
//     console.log('Connected to the server:', socket.id);
//     setUserID(socket.id);
//   });
 

//   //-->receiving event from backend 

//   socket.on("welcome",(s)=>{
//    console.log(s)
//   })

//   // send data from frontend -->data-->refresh frontend 
//    socket.emit("justDo","something some data passing from frontend")


//    // data receiving real time data
//    socket.on("send-message",(data)=>{
//     console.log(data)
//     setInputValue((prevMessages) => [...prevMessages, data]);
//    //setInputValue(data)

//    })

//  // disconnnect frontend 
//    return ()=>{
//     socket.disconnect()
//    }

// },[])
      
//   let submitHandler= (e)=>{
//     e.preventDefault()
//     socket.emit("message", message) 
//     //socket.emit("message",{message,room})
//      setMessage("")
//   }

//   return (
//     <>
//       <h>websocket777:
//         <br></br>{userID}</h>
//       <form onSubmit={submitHandler}>
//         <input value={message} onChange={(e)=>{setMessage(e.target.value)}} type='text'></input>
//         <br></br>
//         <br></br>


//         {/* <h6> data came from  user:{message}</h6> */}
//         <button style={{color:"red", cursor:"pointer"}} type='submit'>submit</button>

//         <h6>Messages from users:</h6>
//         <ul>
//           {inputvalue.map((msg, index) => (
//             <li key={index}>{msg}</li>
//           ))}
//         </ul>

//       </form>
//     </>
//   )
// }

// export default App






// App.js
import { useState, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [targetSocketID, setTargetSocketID] = useState(''); // New state to store the target socket ID
  const [inputvalue, setInputValue] = useState([]);
  const [userID, setUserID] = useState('');

  const socket = useMemo(() => io('http://localhost:3002/'), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server:', socket.id);
      setUserID(socket.id);
    });

    socket.on('welcome', (s) => {
      console.log(s);
    });

    socket.on('send-message', (data) => {
      console.log(data);
      setInputValue((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (targetSocketID.trim() === '') {
      // Send to all if no target socket ID is specified
      socket.emit('message', { message, userID });
    } else {
      // Send to a specific socket ID
      socket.emit('message-to', { message, targetSocketID });
      
    }

    setMessage('');
    setTargetSocketID('');
  };

  return (
    <>
      <h>websocket777: {userID}</h>
      <form onSubmit={submitHandler}>
        <label>
          Message:
          <input value={message} onChange={(e) => setMessage(e.target.value)} type='text'></input>
        </label>
        <br />
        <label>
          Target Socket ID (optional):
          <input value={targetSocketID} onChange={(e) => setTargetSocketID(e.target.value)} type='text'></input>
        </label>
        <br />
        <button style={{ color: 'red', cursor: 'pointer' }} type='submit'>
          Submit
        </button>

        <h6>Messages from users:</h6>
        <ul>
          {targetSocketID||inputvalue.map((msg, index) => (
            <li key={index}>
              {msg.userID}: {msg.message}
            </li>
          ))}
        </ul>
      </form>
    </>
  );
}

export default App;
