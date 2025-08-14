import MainNav from './MainNav';
import { Container } from 'react-bootstrap';

export default function Layout(props) {
  console.log("Layout type:", typeof Layout); 
  console.log("Component type:", typeof Component);
  return (
    <>
    
      <MainNav />
      <br />
      <Container>
        {props.children}
      </Container>
      <br />
    </>
  );
}
