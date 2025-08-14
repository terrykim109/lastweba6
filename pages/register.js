// import { useState } from "react";
// import { useRouter } from "next/router";
// import { registerUser } from "@/lib/authenticate";
// import { Alert, Button, Card, Form } from "react-bootstrap";

// export default function Register() {
//   const router = useRouter();
//   const [user, setUser] = useState("");
//   const [password, setPassword] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [warning, setWarning] = useState("");

//   //   async function handleSubmit(e) {
//   //     e.preventDefault();
//   //     try {
//   //       await registerUser(user, password, password2);
//   //       router.push("/login");
//   //     } catch (err) {
//   //       setWarning(err.message);
//   //     }
//   //   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     // Check if passwords match
//     if (password !== password2) {
//       setWarning("Passwords do not match");
//       return;
//     }

//     const success = await registerUser(user, password, password2);

//     if (success) {
//       router.push("/login");
//     } else {
//       setWarning("Registration failed - please try again");
//     }
//   }
//   return (
//     <div className="container mt-5 pt-5">
//       <Card>
//         <Card.Body>
//           <h2>Register</h2>
//           <p>Register for an account:</p>
//           {warning && <Alert variant="danger">{warning}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group>
//               <Form.Label>Username:</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={user}
//                 onChange={(e) => setUser(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Password:</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Confirm Password:</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={password2}
//                 onChange={(e) => setPassword2(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Button type="submit" variant="primary" className="mt-3">
//               Register
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { Alert, Button, Card, Form } from "react-bootstrap";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [warning, setWarning] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Check if passwords match before making the API call
      if (password !== password2) {
        throw new Error("Passwords do not match");
      }
      
      await registerUser(user, password, password2);
      router.push("/login");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <Card>
        <Card.Body>
          <h2>Register</h2>
          <p>Register for an account:</p>
          {warning && <Alert variant="danger">{warning}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
