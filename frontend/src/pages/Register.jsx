import Form from "../components/Form";
import "../styles/Form.css"; 

function Register() {
  return (
    <div className="form-page-wrapper">
      <Form route="/api/user/register/" method="register" />
    </div>
  );
}

export default Register;
