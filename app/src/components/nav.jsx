import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

function AppNav({handleConnect, isConnected}) {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
    <Container>
    <Navbar.Brand href="#home">SenNet Cypress Service</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
        <Button onClick={handleConnect} variant={isConnected ? 'success' : 'warning'}>{isConnected ? 'Connected' : 'Connect'}</Button>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
}

export default AppNav;