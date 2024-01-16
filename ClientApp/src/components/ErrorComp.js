import { Alert } from "reactstrap";
import './styles/ErrorComp.css';

export default function ErrorComp(props) {
    return (
        <Alert color="danger" className="alert">{props.message}</Alert>
    )
}